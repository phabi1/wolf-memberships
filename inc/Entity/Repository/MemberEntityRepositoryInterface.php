<?php


namespace Wolf\Memberships\Entity\Repository;

use Wolf\Core\Entity\EntityRepositoryInterface;

interface MemberEntityRepositoryInterface extends EntityRepositoryInterface
{
    public function existsHash(string $hash): int|null;
}