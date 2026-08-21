<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\Entity\EntityRepositoryInterface;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;

class GetRegistrationUseCase implements UseCaseInterface
{
    private EntityRepositoryInterface $campaignRepository;

    private EntityRepositoryInterface $lessonRepository;

    private EntityRepositoryInterface $requestRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->campaignRepository = $entityManager->getRepository('wolf-memberships.campaign');
        $this->lessonRepository = $entityManager->getRepository('wolf-memberships.lesson');
        $this->requestRepository = $entityManager->getRepository('wolf-memberships.request');
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

        $lessons = $this->lessonRepository->find(['campaign_id' => ['eq' => $campaignId]]);



        $response = [
            'registration_start' => $campaign->registration_start,
            'registration_end' => $campaign->registration_end,
            'lessons' => $lessons
        ];

        if (!empty($params['request_id'])) {
            $token = $params['token'] ?? null;
            if (!$token) {
                throw new \InvalidArgumentException('Token is required for request retrieval.');
            }

            $request = $this->requestRepository->findById($params['request_id']);
            if (!$request) {
                throw new \Exception('Request not found.');
            }

            if ($request->token !== $token) {
                throw new \Exception('Invalid token for the request.');
            }

            $response['request'] = $request->data;
        }

        return $response;

    }
}