<?php

namespace Wolf\Memberships\Entity\Repository;

use Wolf\Core\Entity\EntityRepository;

class MemberEntityRepository extends EntityRepository
{
    public function existsHash($hash)
    {
        $query = $this->db->createQuery();
        $query->select('id')
            ->from($this->definition['table'])
            ->where(
                $this->db->expr()->eq('hash', $hash)
            );
        return $this->db->value();
    }
}