<?php

namespace Wolf\Memberships\Dashboard\Source;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\UseCase\UseCaseBus;
use Wolf\Memberships\Dashboard\SourceBusInterface;

class GetPeriodsForPrint implements SourceBusInterface
{
    private $periodRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->periodRepository = $entityManager->getRepository('wolf-memberships.period');
    }

    public function source(array $data = []): array
    {
        $campaignId = $data['campaign_id'] ?? null;
        if (!$campaignId) {
            throw new \Exception("Campaign ID is required for get periods for print source");
        }

        $periods = $this->periodRepository->find(['campaign_id' => ['eq' => $campaignId]]);

        return [
            'periods' => $periods
        ];
    }
}