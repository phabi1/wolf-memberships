<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;

class CalculateRegistrationTotalUseCase implements UseCaseInterface
{
    private $campaignRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->campaignRepository = $entityManager->getRepository('wolf-memberships.campaign');
    }

    public function execute(array $params = []): array
    {
        $campaignId = $params['campaign_id'] ?? null;
        if (!$campaignId) {
            throw new \InvalidArgumentException('Campaign ID is required.');
        }

        $unitPrice = 13200;

        $participants = $params['participants'] ?? [];

        $items = [];

        foreach ($participants as $index => $participant) {

        $participant = is_array($participant) ? (object) $participant : $participant;

            $birthdate = $participant->birthdate ?? '';

            $items[] = [
                'type' => 'participant',
                'participant_index' => $index,
                'name' => 'Cotisation',
                'amount' => (int) $unitPrice,
                'currency' => 'EUR',
            ];

            $items[] = [
                'type' => 'fee',
                'participant_index' => $index,
                'name' => 'Licence FFRS',
                'amount' => (int) $this->calculateLicenceFee($birthdate),
                'currency' => 'EUR',
            ];
        }

        if (count($participants) > 2) {
            $discountAmount = 1000 * (count($participants) - 1);
            $items[] = [
                'type' => 'discount',
                'participant_index' => null,
                'name' => 'Remise Famille',
                'amount' => -(int) $discountAmount,
                'currency' => 'EUR',
            ];
        }

        return [
            'items' => $items,
            'total_amount' => (int) array_sum(array_column($items, 'amount')),
            'currency' => 'EUR',
        ];
    }

    private function calculateLicenceFee(string $birthdate): int
    {
        if (empty($birthdate)) {
            return 0;
        }

        $licenses = [
            ['age_min' => null, 'age_max' => 6, 'fee' => 1463],
            ['age_min' => 6, 'age_max' => 13, 'fee' => 2478],
            ['age_min' => 13, 'age_max' => null, 'fee' => 4678],
        ];

        $birthDateTime = new \DateTime($birthdate);
        $currentDate = new \DateTime();
        $age = $currentDate->diff($birthDateTime)->y;

        foreach ($licenses as $license) {
            $ageMin = $license['age_min'];
            $ageMax = $license['age_max'];
            if (($ageMin === null || $age >= $ageMin) && ($ageMax === null || $age <= $ageMax)) {
                return $license['fee'];
            }
        }

        return 0;
    }
}
