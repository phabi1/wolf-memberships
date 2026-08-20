<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;

class GetRegistrationUseCase implements UseCaseInterface
{
    private $campaignRepository;

    private $lessonRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->campaignRepository = $entityManager->getRepository('wolf-memberships.campaign');
        $this->lessonRepository = $entityManager->getRepository('wolf-memberships.lesson');
    }

    public function execute(array $params = []): array
    {
        $campaignId = $params['campaignId'] ?? null;
        if (!$campaignId) {
            throw new \InvalidArgumentException('Campaign ID is required.');
        }

        $campaign = $this->campaignRepository->findById($campaignId);

        $lessons = $this->lessonRepository->find(['campaign_id' => ['eq' => $campaignId]]);

        return [
            'registration_start' => $campaign->registration_start,
            'registration_end' => $campaign->registration_end,
            'lessons' => $lessons
        ];

    }
}