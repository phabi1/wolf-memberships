<?php

namespace Wolf\Memberships\Controller;

class PeriodController extends AbstractCampaignController
{
    protected $entityName = 'wolf-memberships.period';

    private $useCaseBus;

    public function __construct($useCaseBus)
    {
        $this->useCaseBus = $useCaseBus;
    }

    public function print($request)
    {
        $periodId = $request->get_param('id');
        if (!$periodId) {
            return new \WP_Error('period_id_required', 'Period ID parameter is required', ['status' => 400]);
        }

        $log = $this->useCaseBus->execute('wolf-memberships.print_period', [
            'id' => $periodId
        ]);

        if (isset($log['error'])) {
            return new \WP_Error('print_failed', $log['error'], ['status' => 500]);
        }

        return [
            'success' => true,
            'file_url' => $log['file_url']
        ];
    }
}