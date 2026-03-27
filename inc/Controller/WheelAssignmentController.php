<?php

namespace Wolf\Memberships\Controller;

use Wolf\Core\Mvc\Controller\EntityController;

class WheelAssignmentController extends EntityController
{
    protected $entityName = 'wolf-memberships.member_wheel_assignment';

    protected function buildFilters($request)
    {
        $filters = parent::buildFilters($request);
        $memberId = $request->get_param('member_id');
        if ($memberId) {
            $filters['member_id'] = ['eq' => $memberId];
        }
        return $filters;
    }
}