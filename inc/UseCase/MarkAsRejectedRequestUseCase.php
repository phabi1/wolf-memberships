<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;
use Wolf\Core\Mail\MailService;

class MarkAsRejectedRequestUseCase implements UseCaseInterface
{
    private $requestRepository;
    private $mailService;

    public function __construct(EntityManager $entityManager, MailService $mailService)
    {
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

        if (!$request->status == 'pending' && !$request->status == 'approved') {
            throw new \Exception('Only pending or approved requests can be rejected.');
        }

        // Update the request status to 'approved'
        $updatedRequest = $this->requestRepository->update($requestId, [
            'status' => 'rejected',
        ]);

        // Send an email notification to the user
        try {
            $this->mailService->sendMail(
                $updatedRequest->email,
                'wolf-memberships:request_rejected',
                [
                    'firstname' => $updatedRequest->firstname,
                    'lastname' => $updatedRequest->lastname,
                    'campaign_id' => $campaignId,
                    'request_id' => $requestId,
                ]
            );
        } catch (\Exception $e) {
            // Log the error or handle it as needed
            error_log('Failed to send rejection email: ' . $e->getMessage());
        }

        return [];
    }
}