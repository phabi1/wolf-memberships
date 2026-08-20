<?php

namespace Wolf\Memberships\Entity\Repository;

use stdClass;
use Wolf\Core\Entity\EntityRepository;

class CheckoutEntityRepository extends EntityRepository implements CheckoutEntityRepositoryInterface
{
    public function findByOrder(int $campaignId, string $orderId): stdClass|null
    {
        $query = $this->db->createQuery();
        $query
            ->from($this->definition['table'])
            ->where(
                $this->db->expr()->eq('campaign_id', $campaignId),
            )
            ->where('json_extract(meta, "$.order_id") = "' . $orderId . '"');
        $res = $this->db->row($query);
        return $res !== null ? $this->unserialize($res) : null;
    }
}