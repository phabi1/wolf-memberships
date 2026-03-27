<?php

namespace Wolf\Memberships\Controller;

use Wolf\Core\Mvc\Controller\AbstractController;
use Wolf\Memberships\Dashboard\SourceBus;

class DashboardController extends AbstractController
{
    private $sourceBus;

    public function __construct(SourceBus $sourceBus)
    {
        $this->sourceBus = $sourceBus;
    }

    public function sourceAction($request)
    {
        $data = $request->get_query_params();
        if (empty($data['type'])) {
            return new \WP_Error('missing_type', 'Type parameter is required', ['status' => 400]);
        }
        return $this->sourceBus->execute($data['type'], $data);
    }
}