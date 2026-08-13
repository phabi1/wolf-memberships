<?php

namespace Wolf\Memberships\Entity\Repository;

use Wolf\Core\Entity\EntityRepository;

class MemberEntityRepository extends EntityRepository
{
    public function existsHash(string $hash): int|null
    {
        $query = $this->db->createQuery();
        $query->select('id')
            ->from($this->definition['table'])
            ->where(
                $this->db->expr()->eq('hash', $hash)
            );
        $res = $this->db->value($query);
        return $res !== null ? (int) $res : null;
    }
}