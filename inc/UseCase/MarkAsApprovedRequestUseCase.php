<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;
use Wolf\Core\Mail\MailService;

class MarkAsApprovedRequestUseCase implements UseCaseInterface
{
    private $campaignRepository;

    private $requestRepository;
    private $mailService;

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

        $requestId = $params['request_id'] ?? null;
        if (!$requestId) {
            throw new \InvalidArgumentException('Request ID is required.');
        }

        // Fetch the request from the repository
        $request = $this->requestRepository->findById($requestId);
        if (!$request) {
            throw new \Exception('Request not found.');
        }

        if ($request->status !== 'pending' && $request->status !== 'rejected') {
            throw new \Exception('Only pending or rejected requests can be approved.');
        }

        $campaign = $this->campaignRepository->findById($campaignId);

        // Update the request status to 'approved'
        $updatedRequest = $this->requestRepository->update($requestId, [
            'status' => 'approved',
        ]);

        // Generate a payment URL (this is just a placeholder, implement your own logic)
        $paymentUrl = $this->buildPaymentUrl($campaignId, $updatedRequest);

        // Send an email notification to the user
        try {
            $this->mailService->sendMail(
                $updatedRequest->email,
                'wolf-membership:request-approved',
                [
                    'firstname' => $updatedRequest->firstname,
                    'lastname' => $updatedRequest->lastname,
                    'campaignName' => $campaign->title,
                    'request_id' => $requestId,
                    'paymentUrl' => $paymentUrl ?? null,
                ]
            );
        } catch (\Exception $e) {
            // Log the error or handle it as needed
            error_log('Failed to send approval email: ' . $e->getMessage());
        }

        return [];
    }

    private function buildPaymentUrl($campaignId, $request)
    {
        $pageId = get_option('wolf_membership_pay_page', 'https://yourwebsite.com/payment');
        if (!$pageId) {
            throw new \Exception('Payment page is not configured.');
        }
        return get_permalink($pageId) . "?campaign_id={$campaignId}&request_id={$request->id}&token={$request->token}";
    }
}