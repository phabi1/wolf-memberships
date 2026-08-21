<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\Entity\EntityRepositoryInterface;
use Wolf\Core\UseCase\UseCaseBus;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;
use Wolf\Core\Mail\MailService;

class UpdateRequestUseCase implements UseCaseInterface
{
    private EntityRepositoryInterface $campaignRepository;

    private EntityRepositoryInterface $requestRepository;

    private MailService $mailService;

    public function __construct(EntityManager $entityManager, MailService $mailService)
    {
        $this->campaignRepository = $entityManager->getRepository('wolf-memberships.campaign');
        $this->requestRepository = $entityManager->getRepository('wolf-memberships.request');
        $this->mailService = $mailService;
    }

    public function execute(array $params = []): array
    {
        $campaignId = $params['campaign_id'] ?? null;
        if (!$campaignId) {
            throw new \InvalidArgumentException('Campaign ID is required.');
        }

        $campaign = $this->campaignRepository->findById($campaignId);
        if (!$campaign) {
            throw new \Exception('Campaign not found.');
        }

        if ($campaign->registration_start && $campaign->registration_end) {
            $now = new \DateTime();
            $start = new \DateTime($campaign->registration_start);
            $end = new \DateTime($campaign->registration_end);

            if ($now < $start || $now > $end) {
                throw new \Exception('Registration is not open for this campaign.');
            }
        }

        if (!isset($params['request_id'])) {
            throw new \InvalidArgumentException('Request ID is required for updating a request.');
        }

        $request = $this->requestRepository->findById($params['request_id']);
        if (!$request) {
            throw new \Exception('Request not found.');
        }

        if ($request->token !== $params['token']) {
            throw new \Exception('Invalid token for the request.');
        }

        $request = $this->requestRepository->update($params['request_id'], [
            'firstname' => $params['contact']['firstname'] ?? null,
            'lastname' => $params['contact']['lastname'] ?? null,
            'email' => $params['contact']['email'] ?? null,
            'phone' => $params['contact']['phone'] ?? null,
            'data' => $params['data'] ?? [],
            'campaign_id' => $campaignId,
        ]);

        if ($this->sendConfirmationEmail($campaign, $request) === false) {
            throw new \Exception('Failed to send confirmation email.');
        }

        if ($this->sendNewRequestEmail($campaign, $request) === false) {
            throw new \Exception('Failed to send new request email.');
        }

        return [
            'request_id' => $request->id,
        ];
    }

    private function buildEditUrl($campaign, $request): string
    {
        $pageId = get_option('wolf_membership_registration_page');

        return get_permalink($pageId) . "?campaign_id={$campaign->id}&request_id={$request->id}&token={$request->token}";
    }

    private function sendConfirmationEmail($campaign, $request): bool
    {
        $email = $request->email;
        $context = ['editUrl' => $this->buildEditUrl($campaign, $request)];
        return $this->mailService->sendMail($email, 'wolf-membership:confirmation', $context);

    }

    private function sendNewRequestEmail($campaign, $request): bool
    {
        $email = 'phabi1@hotmail.fr';
        $context = [
            'campaignName' => $campaign->name,
            'memberName' => $request->firstname . ' ' . $request->lastname,
            'memberEmail' => $request->email,
            'requestId' => $request->id,
            'adminUrl' => admin_url('admin.php?page=wolf-membership-requests'),
        ];
        return $this->mailService->sendMail($email, 'wolf-membership:new-request', $context);
    }
}