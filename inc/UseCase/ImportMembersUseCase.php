<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Memberships\Helper\MemberHelper;

class ImportMembersUseCase implements UseCaseInterface
{
    private $memberRepository;
    private $memberHelper;

    public function __construct(EntityManager $entityManager, MemberHelper $memberHelper)
    {
        $this->memberRepository = $entityManager->getRepository('wolf-memberships.member');
        $this->memberHelper = $memberHelper;
    }

    public function execute(array $params = [])
    {
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

            $birthdate = $this->extractBirthdate($data);
            $hash = $this->memberHelper->generateHash($data['firstName'], $data['lastName'], $birthdate);
            $existsingMember = $this->memberRepository->findOne([
                'hash' => ['eq' => $hash],
            ]);

            if ($existsingMember) {
                $updated = $this->updateMember($existsingMember, $data);
                if ($updated) {
                    $log['updated']++;
                } else {
                    $log['skipped']++;
                }
            } else {
                $this->createMember($data);
                $log['created']++;
            }
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

        $this->memberRepository->create([
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
    private function updateMember($member, array $data): bool
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
            return false; // No update needed
        }

        $this->memberRepository->update($member->id, $updateData);
        return true;
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