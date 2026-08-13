<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\Entity\EntityRepositoryInterface;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Memberships\Entity\Repository\MemberEntityRepository;

class ExportSubscriptionsUseCase implements UseCaseInterface
{

    /**
     * @var MemberEntityRepository 
     */
    private $memberRepository;
    /**
     * Summary of subscriptionRepository
     * @var EntityRepositoryInterface
     */
    private $subscriptionRepository;


    public function __construct(EntityManager $entityManager)
    {
        $this->memberRepository = $entityManager->getRepository('wolf-memberships.member');
        $this->subscriptionRepository = $entityManager->getRepository('wolf-memberships.subscription');
    }
    public function execute(array $data = []): mixed
    {
        $campaignId = $data['campaign_id'] ?? null;

        if (!$campaignId) {
            throw new \InvalidArgumentException('Campaign ID parameter is required');
        }

        $subscriptions = $this->subscriptionRepository->find(['campaign_id' => ['eq' => $campaignId]]);

        $exportData = [];
        foreach ($subscriptions as $subscription) {
            $member = $this->memberRepository->findById($subscription->member_id);
            if ($member) {
                $exportData[] = [
                    'firstName' => $member->firstname,
                    'lastName' => $member->lastname,
                    'birthdate' => $member->birthdate->format('Y-m-d'),
                ];
            }
        }

        $file = tempnam(sys_get_temp_dir(), 'subscriptions_export_') . '.csv';

        $handle = fopen($file, 'w');
        if ($handle === false) {
            throw new \RuntimeException('Could not open file for writing');
        }

        // Write header
        fputcsv($handle, ['firstName', 'lastName', 'birthdate']);

        // Write data
        foreach ($exportData as $row) {
            fputcsv($handle, $row);
        }

        fclose($handle);

        return [
            'file_url' => $file
        ];

    }
}