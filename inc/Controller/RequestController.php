<?php

namespace Wolf\Memberships\Controller;

class RequestController extends AbstractCampaignController
{

    protected $entityName = 'wolf-memberships.request';

    public function approveAction(\WP_REST_Request $request)
    {
        if (!$request->get_param('campaign_id') || !$request->get_param('request_id')) {
            return [
                'success' => false,
                'message' => 'Missing campaign_id or request_id parameter.'
            ];
        }

        $useCaseBus = $this->getService('wolf.use_case_bus');
        $useCaseBus->execute('wolf-memberships.approve_request', [
            'campaign_id' => $request->get_param('campaign_id'),
            'request_id' => $request->get_param('request_id')
        ]);

        return [
            'success' => true,
            'message' => 'Request approved successfully.'
        ];
    }

    public function rejectAction(\WP_REST_Request $request)
    {
        if (!$request->get_param('campaign_id') || !$request->get_param('request_id')) {
            return [
                'success' => false,
                'message' => 'Missing campaign_id or request_id parameter.'
            ];
        }

        $useCaseBus = $this->getService('wolf.use_case_bus');
        $useCaseBus->execute('wolf-memberships.reject_request', [
            'campaign_id' => $request->get_param('campaign_id'),
            'request_id' => $request->get_param('request_id')
        ]);

        return [
            'success' => true,
            'message' => 'Request rejected successfully.'
        ];
    }

    public function paidAction(\WP_REST_Request $request)
    {
        if (!$request->get_param('campaign_id') || !$request->get_param('request_id')) {
            return [
                'success' => false,
                'message' => 'Missing campaign_id or request_id parameter.'
            ];
        }

        $useCaseBus = $this->getService('wolf.use_case_bus');
        $useCaseBus->execute('wolf-memberships.paid_request', [
            'campaign_id' => $request->get_param('campaign_id'),
            'request_id' => $request->get_param('request_id')
        ]);

        return [
            'success' => true,
            'message' => 'Request marked as paid successfully.'
        ];
    }
}