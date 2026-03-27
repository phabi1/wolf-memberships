<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Memberships\Helper\MemberHelper;

class ImportSubscriptionsUseCase implements UseCaseInterface
{
    private $subscriptionRepository;

    private $memberRepository;

    private $sessionRepository;

    private $memberHelper;

    public function __construct(EntityManager $entityManager, MemberHelper $memberHelper)
    {
        $this->memberRepository = $entityManager->getRepository('wolf-memberships.member');
        $this->subscriptionRepository = $entityManager->getRepository('wolf-memberships.subscription');
        $this->sessionRepository = $entityManager->getRepository('wolf-memberships.session');
        $this->memberHelper = $memberHelper;
    }

    public function execute(array $params = [])
    {
        $campaignId = $params['campaign_id'] ?? null;
        if (!$campaignId) {
            throw new \InvalidArgumentException('Campaign ID parameter is required');
        }
        $file = $params['file'] ?? null;
        if (!$file) {
            throw new \InvalidArgumentException('File parameter is required');
        }

        $handle = fopen($file, 'r');
        if ($handle === false) {
            throw new \RuntimeException('Could not open file for reading');
        }

        $log = [
            'created' => 0,
            'updated' => 0,
            'skipped' => 0,
        ];

        $header = fgetcsv($handle);
        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);

            if ($data['choice1'] === '0' && $data['choice2'] === '0') {
                $log['skipped']++;
                continue; // Skip if no subscription choice is made
            }

            $birthdate = $this->extractBirthdate($data);
            $hash = $this->memberHelper->generateHash($data['firstName'], $data['lastName'], $birthdate);
            $existsingMember = $this->memberRepository->findOne([
                'hash' => ['eq' => $hash],
            ]);

            if ($existsingMember) {
                $member = $this->updateMember($existsingMember, $data);
            } else {
                $member = $this->createMember($data);
            }

            if ($data['registration'] === '1') {
                $log['skipped']++;
                continue;
            }

            $existingSubscription = $this->subscriptionRepository->findOne([
                'member_id' => ['eq' => $member->id],
                'campaign_id' => ['eq' => $campaignId],
            ]);

            if ($existingSubscription) {
                $log['skipped']++;
                continue;
            }

            $subscription = $this->subscriptionRepository->insert([
                'member_id' => $member->id,
                'campaign_id' => $campaignId,
            ]);

            if (!empty($data['choice1'])) {
                $this->sessionRepository->insert([
                    'lesson_id' => $data['choice1'], // Assuming lesson_id 1 for choice1
                    'subscription_id' => $subscription->id,
                    'member_id' => $member->id,
                    'campaign_id' => $campaignId,
                ]);
            }
            if (!empty($data['choice2'])) {
                $this->sessionRepository->insert([
                    'lesson_id' => $data['choice2'], // Assuming lesson_id 1 for choice1 and 2 for choice2
                    'subscription_id' => $subscription->id,
                    'member_id' => $member->id,
                    'campaign_id' => $campaignId,
                ]);
            }

            $log['created']++;
        }
        fclose($handle);
        return $log;
    }

    /**
     * Creates a new member in the database.
     * @param array $data
     */
    private function createMember(array $data)
    {
        $birthdate = $this->extractBirthdate($data);
        $hash = $this->memberHelper->generateHash($data['firstName'], $data['lastName'], $birthdate);

        return $this->memberRepository->create([
            'firstname' => $data['firstName'],
            'lastname' => $data['lastName'],
            'birthdate' => date('Y-m-d', $birthdate),
            'license_number' => $this->isValidLicenseNumber($data['licence'] ?? null) ? $data['licence'] : null,
            'hash' => $hash
        ]);
    }

    /**
     * Updates a member's information if necessary.
     * @param mixed $member
     * @param array $data
     * @return bool Returns true if the member was updated, false if no update was needed
     */
    private function updateMember($member, array $data)
    {
        $updateData = [];

        if (
            isset($data['licence'])
            && $this->isValidLicenseNumber($data['licence'])
            && $data['licence'] !== $member->license_number
        ) {
            $updateData['license_number'] = $data['licence'];
        }

        if (empty($updateData)) {
            return $member;
        }

        return $this->memberRepository->update($member->id, $updateData);
    }

    private function isValidLicenseNumber($licenseNumber)
    {
        // Implement your validation logic here (e.g., regex check)
        return preg_match('/^[0-9]+$/', $licenseNumber);
    }

    private function extractBirthdate(array &$data)
    {
        $year = $data['yearBirthday'] ?? null;
        $month = $data['monthBirthday'] ?? null;
        $day = $data['dayBirthday'] ?? null;

        return strtotime("$year-$month-$day");
    }
}