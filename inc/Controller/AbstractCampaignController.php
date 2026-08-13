<?php

namespace Wolf\Memberships\Controller;

use Wolf\Core\Mvc\Controller\EntityController;

abstract class AbstractCampaignController extends EntityController
{
    protected function buildFilters($request)
    {
        $filters = parent::buildFilters($request);
        $campaignId = $request->get_param('campaign_id');
        if ($campaignId) {
            $filters['campaign_id'] = ['eq' => $campaignId];
        }
        return $filters;
    }

    protected function prepareDataFromRequest(array $body, \WP_REST_Request $request)
    {
        $data = parent::prepareDataFromRequest($body, $request);
        $campaignId = $request->get_param('campaign_id');
        if ($campaignId) {
            $data['campaign_id'] = (int) $campaignId;
        }
        return $data;
    }
}