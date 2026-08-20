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
            'campaignId' => $request->get_param('campaign_id')
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
            'campaignId' => $campaignId,
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
        $useCaseBus = $this->getService('wolf.use_case_bus');
        $payload = $request->get_json_params() ?: [];

        $participants = $payload['participants'] ?? [];
        $campaignId = $request->get_param('campaign_id');

        $total = $useCaseBus->execute('wolf-memberships.calculate_registration_total', [
            'campaignId' => $campaignId,
            'participants' => $participants,
        ]);

        $payload['total_amount'] = $total['total_amount'] ?? 0;
        $payload['pricing_breakdown'] = $total['items'] ?? [];

        $useCaseBus->execute('wolf-memberships.register_to_campaign', [
            'campaignId' => $campaignId,
            'participants' => $participants,
            'payer' => $payload['payer'] ?? null,
            'total_amount' => $payload['total_amount'],
        ]);

        return [
            'success' => true,
            'total_amount' => $payload['total_amount'],
            'participants_count' => $total['participants_count'] ?? count($participants),
            'currency' => $total['currency'] ?? 'EUR',
            'summary' => [
                'total_amount' => $payload['total_amount'],
                'participants_count' => $total['participants_count'] ?? count($participants),
                'currency' => $total['currency'] ?? 'EUR',
            ],
            'pricing_breakdown' => $payload['pricing_breakdown'],
        ];
    }
}