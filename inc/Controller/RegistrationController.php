<?php


namespace Wolf\Memberships\Controller;

use Wolf\Core\Mvc\Controller\AbstractController;
use WP_REST_Request;

class RegistrationController extends AbstractController
{
    public function registrationAction(WP_REST_Request $request)
    {

        $useCaseBus = $this->getService('wolf.use_case_bus');

        $res = $useCaseBus->execute('wolf-memberships.get_registration_for_campaign', [
            'campaign_id' => $request->get_param('campaign_id'),
            'request_id' => $request->get_param('request_id'),
            'token' => $request->get_param('token')
        ]);

        return $res;
    }

    public function calculateTotalAction(WP_REST_Request $request)
    {
        $useCaseBus = $this->getService('wolf.use_case_bus');
        $payload = $request->get_json_params() ?: [];

        $participants = $payload['participants'] ?? [];
        $campaignId = $request->get_param('campaign_id');

        $total = $useCaseBus->execute('wolf-memberships.calculate_registration_total', [
            'campaign_id' => $campaignId,
            'participants' => $participants,
        ]);

        return [
            'success' => true,
            'total_amount' => $total['total_amount'] ?? 0,
            'participants_count' => $total['participants_count'] ?? 0,
            'currency' => $total['currency'] ?? 'EUR',
            'pricing_breakdown' => $total['items'] ?? [],
        ];
    }

    public function registerAction(WP_REST_Request $request)
    {
        $campaignId = $request->get_param('campaign_id');
        $payload = $request->get_json_params() ?: [];

        if (!$campaignId) {
            return [
                'success' => false,
                'message' => 'Missing campaign_id parameter.'
            ];
        }

        $useCaseBus = $this->getService('wolf.use_case_bus');

        $requestId = $payload['request_id'] ?? null;
        $token = $payload['token'] ?? null;

        if ($requestId) {
            $useCaseBus->execute('wolf-memberships.update_request', [
                'campaign_id' => $campaignId,
                'request_id' => $requestId,
                'token' => $token,
                'contact' => [
                    'firstname' => $payload['contact']['firstname'] ?? null,
                    'lastname' => $payload['contact']['lastname'] ?? null,
                    'email' => $payload['contact']['email'] ?? null,
                    'phone' => $payload['contact']['phone'] ?? null,
                ],
                'data' => $payload['data'] ?? [],
            ]);
        } else {
            $useCaseBus->execute('wolf-memberships.register_to_campaign', [
                'campaign_id' => $campaignId,
                'contact' => [
                    'firstname' => $payload['contact']['firstname'] ?? null,
                    'lastname' => $payload['contact']['lastname'] ?? null,
                    'email' => $payload['contact']['email'] ?? null,
                    'phone' => $payload['contact']['phone'] ?? null,
                ],
                'data' => $payload['data'] ?? [],
            ]);
        }

        return [
            'success' => true,
        ];
    }
}