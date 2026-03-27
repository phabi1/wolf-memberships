<?php

namespace Wolf\Memberships\Controller;

use Wolf\Core\Mvc\Controller\EntityController;
use Wolf\Core\UseCase\UseCaseBus;
use Wolf\Memberships\Entity\Service\SubscriptionEntityService;

class SubscriptionController extends EntityController
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
}