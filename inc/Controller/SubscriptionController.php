<?php

namespace Wolf\Memberships\Controller;

use Wolf\Core\UseCase\UseCaseBus;

class SubscriptionController extends AbstractCampaignController
{
    private $useCaseBus;

    protected $entityName = 'wolf-memberships.subscription';

    public function __construct(UseCaseBus $useCaseBus)
    {
        $this->useCaseBus = $useCaseBus;
    }

    public function importAction($request)
    {
        $campaignId = $request->get_param('campaign_id');
        if (!$campaignId) {
            return new \WP_Error('campaign_id_required', 'Campaign ID parameter is required', ['status' => 400]);
        }
        $files = $request->get_file_params();

        if (empty($files['file'])) {
            return new \WP_Error('file_not_provided', 'No file provided for import', ['status' => 400]);
        }

        $log = $this->useCaseBus->execute('wolf-memberships.import_subscriptions', [
            'campaign_id' => $campaignId,
            'file' => $files['file']['tmp_name']
        ]);

        return [
            'success' => true,
            'log' => $log
        ];
    }

    public function exportAction($request)
    {
        $campaignId = $request->get_param('campaign_id');
        if (!$campaignId) {
            return new \WP_Error('campaign_id_required', 'Campaign ID parameter is required', ['status' => 400]);
        }

        $log = $this->useCaseBus->execute('wolf-memberships.export_subscriptions', [
            'campaign_id' => $campaignId
        ]);

        if (isset($log['error'])) {
            return new \WP_Error('export_failed', $log['error'], ['status' => 500]);
        }

        // Serve the file for download
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="subscriptions_export.csv"');
        readfile($log['file_url']);
        unlink($log['file_url']); // Clean up the temporary file
        exit;
    }
}