<?php

namespace Wolf\Memberships\Dashboard\Source;

use Wolf\Core\UseCase\UseCaseBus;
use Wolf\Memberships\Dashboard\SourceBusInterface;

class LessonsCompletude implements SourceBusInterface
{
    private $useCaseBus;

    public function __construct(UseCaseBus $useCaseBus)
    {
        $this->useCaseBus = $useCaseBus;
    }

    public function source(array $data = []): array
    {
        $campaignId = $data['campaign_id'] ?? null;
        if (!$campaignId) {
            throw new \Exception("Campaign ID is required for lesson completude source");
        }

        $result = $this->useCaseBus->execute('wolf-memberships.get_lessons_completude', [
            'campaign_id' => $campaignId
        ]);

        return [
            'sessions' => $result
        ];
    }
}
