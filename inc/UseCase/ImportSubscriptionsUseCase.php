<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\Helper\DateHelper;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Memberships\Helper\MemberHelper;
use Wolf\Memberships\Model\LicenseType;

class ImportSubscriptionsUseCase implements UseCaseInterface
{
    private $subscriptionRepository;

    private $contactRepository;

    private $memberRepository;

    private $sessionRepository;

    private $memberHelper;

    private $dateHelper;

    public function __construct(EntityManager $entityManager, MemberHelper $memberHelper, DateHelper $dateHelper)
    {
        $this->memberRepository = $entityManager->getRepository('wolf-memberships.member');
        $this->subscriptionRepository = $entityManager->getRepository('wolf-memberships.subscription');
        $this->contactRepository = $entityManager->getRepository('wolf-memberships.contact');
        $this->sessionRepository = $entityManager->getRepository('wolf-memberships.session');
        $this->memberHelper = $memberHelper;
        $this->dateHelper = $dateHelper;
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

        $separator = isset($params['separator']) ? $params['separator'] : ',';

        $fields = isset($params['fields']) ? $params['fields'] : [
            'subscribed_at' => 'Date de la commande',
            'firstName' => 'Prénom adhérent',
            'lastName' => 'Nom adhérent',
            'birthdate' => 'Date de naissance de l\'adhérent',
            'lesson' => 'Tarif',
            'license_type' => 'Type de licence',
            'licence' => 'Numéro de licence',
            'legal_guardian_lastName_1' => 'Nom du tuteur légal 1 (obligatoire si adhérent mineur)',
            'legal_guardian_firstName_1' => 'Prénom du tuteur légal 1 (obligatoire si adhérent mineur)',
            'legal_guardian_phone_1' => 'Téléphone du tuteur légal 1 (obligatoire si adhérent mineur)',
            'legal_guardian_lastName_2' => 'Nom du tuteur légal 2 (obligatoire si adhérent mineur)',
            'legal_guardian_firstName_2' => 'Prénom du tuteur légal 2 (obligatoire si adhérent mineur)',
            'legal_guardian_phone_2' => 'Téléphone du tuteur légal 2 (obligatoire si adhérent mineur)',
        ];

        $header = fgetcsv($handle, 0, $separator);
        while (($row = fgetcsv($handle, 0, $separator)) !== false) {
            // Transform the row into an associative array using the header
            $data = $this->transformRowWithHeader($fields, $header, $row);

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

            $existingSubscription = $this->subscriptionRepository->findOne([
                'member_id' => ['eq' => $member->id],
                'campaign_id' => ['eq' => $campaignId],
            ]);

            if ($existingSubscription) {
                $log['skipped']++;
                continue;
            }

            if (!isset($data['license_type']) || !LicenseType::isValidType($data['license_type'])) {
                $log['skipped']++;
                continue;
            }

            $subscribedAt = null;
            try {
                $subscribedAt = isset($data['subscribed_at']) && !empty($data['subscribed_at'])
                    ? $this->dateHelper->convertToTimestamp($data['subscribed_at'], DateHelper::FORMAT_DMYHI)
                    : time();
            } catch (\Exception $e) {
                $subscribedAt = time();
            }

            $subscription = $this->subscriptionRepository->insert([
                'subscribed_at' => $subscribedAt,
                'license_type' => $data['license_type'] ?? null,
                'member_id' => $member->id,
                'campaign_id' => $campaignId,
            ]);

            $contactData = $this->extractContacts($data);
            foreach ($contactData as $contact) {
                $this->contactRepository->insert([
                    'firstname' => $contact['firstName'],
                    'lastname' => $contact['lastName'],
                    'phone' => $contact['phone'] ?? null,
                    'email' => $contact['email'] ?? null,
                    'subscription_id' => $subscription->id,
                ]);
            }


            if (!empty($data['lesson'])) {
                $this->sessionRepository->insert([
                    'lesson_id' => $data['lesson'],
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
     * Extracts contact information from the data array.
     * @param array $data
     * @return array
     */
    private function extractContacts(array $data): array
    {
        $contacts = [];
        for ($i = 1; $i <= 2; $i++) {
            if (!empty($data["legal_guardian_lastName_$i"]) && !empty($data["legal_guardian_firstName_$i"])) {
                $contacts[] = [
                    'lastName' => $data["legal_guardian_lastName_$i"],
                    'firstName' => $data["legal_guardian_firstName_$i"],
                    'phone' => $data["legal_guardian_phone_$i"] ?? null,
                    'email' => $data["legal_guardian_email_$i"] ?? null,
                ];
            }
        }
        return $contacts;
    }

    /**
     * Transforms a CSV row into an associative array using the provided header mapping.
     * @param array $fields
     * @param array $row
     * @return array
     */
    private function transformRowWithHeader(array $fields, array $header, array $row)
    {
        $data = [];
        $values = array_combine($header, $row);
        foreach ($fields as $key => $fieldName) {
            if (isset($values[$fieldName])) {
                $data[$key] = $values[$fieldName];
            }
        }
        return $data;
    }

    /**
     * Creates a new member in the database.
     * @param array $data
     */
    private function createMember(array $data)
    {
        $birthdate = $this->extractBirthdate($data);
        $hash = $this->memberHelper->generateHash($data['firstName'], $data['lastName'], $birthdate);

        return $this->memberRepository->insert([
            'firstname' => $data['firstName'],
            'lastname' => $data['lastName'],
            'birthdate' => $birthdate,
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

    /**
     * Validates the license number.
     * @param string|null $licenseNumber
     * @return bool
     */
    private function isValidLicenseNumber(?string $licenseNumber): bool
    {
        if ($licenseNumber === null) {
            return false;
        }
        // Implement your validation logic here (e.g., regex check)
        return preg_match('/^[0-9]+$/', $licenseNumber);
    }

    private function extractBirthdate(array &$data): ?int
    {
        if (isset($data['birthdate'])) {
            list($day, $month, $year) = explode('/', $data['birthdate']);
            $birthdate = strtotime("$year-$month-$day");
            return $birthdate;
        }
        return null;
    }
}