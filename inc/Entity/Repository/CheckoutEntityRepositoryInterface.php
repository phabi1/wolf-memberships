<?php

namespace Wolf\Memberships\Entity\Repository;

use stdClass;
use Wolf\Core\Entity\EntityRepositoryInterface;

interface CheckoutEntityRepositoryInterface extends EntityRepositoryInterface
{
    public function findByOrder(int $campaignId, string $orderId): stdClass|null;
}