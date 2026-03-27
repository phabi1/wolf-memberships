<?php

namespace Wolf\Memberships\Entity\Service;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\Entity\EntityService;
use Wolf\Memberships\Helper\MemberHelper;

class MemberEntityService extends EntityService
{
    private $memberHelper;

    public function __construct(EntityManager $entityManager, MemberHelper $memberHelper)
    {
        parent::__construct($entityManager);
        $this->memberHelper = $memberHelper;
        
    }

    public function create($data)
    {
        $firstname = $data['firstname'] ?? null;
        $lastname = $data['lastname'] ?? null;
        $birthdate = $data['birthdate'] ?? null;

        $hash = $this->memberHelper->generateHash($firstname, $lastname, $birthdate);
        $data['hash'] = $hash;
        try {
            return parent::create($data);
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                throw new \Exception('Member already exists.');
            }
            throw $e;
        }
    }

    public function update($id, $data)
    {
        $entity = parent::item($id);
        if (!$entity) {
            throw new \Exception("Member with ID {$id} not found.");
        }
        $firstname = $data['firstname'] ?? $entity->firstname;
        $lastname = $data['lastname'] ?? $entity->lastname;
        $birthdate = $data['birthdate'] ?? $entity->birthdate;

        $hash = $this->memberHelper->generateHash($firstname, $lastname, $birthdate);
        $data['hash'] = $hash;
        try {
            return parent::update($id, $data);
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                throw new \Exception('Member already exists.');
            }
            throw $e;
        }
    }
}