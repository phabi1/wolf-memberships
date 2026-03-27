<?php

namespace Wolf\Memberships;

use Wolf\Core\Di\ContainerAwareInterface;
use Wolf\Core\Di\ContainerAwareTrait;
use Wolf\Core\Plugin;
use Wolf\Core\Rest\Routes;

class Api implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * Rest routes helper
     * @var Routes
     */
    private $restRoutesHelper;

    public function setup()
    {
        add_action('rest_api_init', function () {
            $this->restRoutesHelper = $this->getContainer()->get('wolf.rest.routes');
            $this->registerDashboardRoutes();
            $this->registerCampaignRoutes();
            $this->registerSubscriptionRoutes();
            $this->registerMemberRoutes();
            $this->registerContactRoutes();
            $this->registerPeriodRoutes();
            $this->registerLessonRoutes();
            $this->registerWheelRoutes();
            $this->registerWheelAssignmentRoutes();
        });
    }

    protected function getContainer()
    {
        if ($this->container === null) {
            $this->setContainer(Plugin::getContainer());
        }
        return $this->container;
    }

    protected function getController($controllerName)
    {
        return $this->getContainer()->get($controllerName);
    }

    protected function registerDashboardRoutes()
    {
        $controller = $this->getController('wolf-memberships.controller.dashboard');
        register_rest_route('wolf-memberships/v1', '/dashboard/source', [
            'methods' => 'GET',
            'callback' => [$controller, 'source'],
            'permission_callback' => '__return_true'
        ]);
    }

    protected function registerMemberRoutes()
    {
        $controller = $this->getController('wolf-memberships.controller.member');
        $this->restRoutesHelper->createRoutes('wolf-memberships/v1', 'members', $controller);
        register_rest_route('wolf-memberships/v1', '/members/import', [
            'methods' => 'POST',
            'callback' => [$controller, 'import'],
            'permission_callback' => '__return_true'
        ]);
        register_rest_route('wolf-memberships/v1', '/members/exists', [
            'methods' => 'GET',
            'callback' => [$controller, 'exists'],
            'permission_callback' => '__return_true'
        ]);
    }

    protected function registerContactRoutes()
    {
        $controller = $this->getController('wolf-memberships.controller.contact');
        $this->restRoutesHelper->createRoutes('wolf-memberships/v1', 'members/(?P<member_id>[\d]+)/contacts', $controller);
    }

    protected function registerSubscriptionRoutes()
    {
        $controller = $this->getController('wolf-memberships.controller.subscription');
        $this->restRoutesHelper->createRoutes('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/subscriptions', $controller);
        register_rest_route('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/subscriptions/import', [
            'methods' => 'POST',
            'callback' => [$controller, 'import'],
            'permission_callback' => '__return_true'
        ]);
    }

    protected function registerCampaignRoutes()
    {
        $controller = $this->getController('wolf-memberships.controller.campaign');
        $this->restRoutesHelper->createRoutes('wolf-memberships/v1', 'campaigns', $controller);
    }

     protected function registerPeriodRoutes()
    {
        $controller = $this->getController('wolf-memberships.controller.period');
        $this->restRoutesHelper->createRoutes('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/periods', $controller);
                register_rest_route('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/periods/(?P<id>[\d]+)/print', [
            'methods' => 'POST',
            'callback' => [$controller, 'print'],
            'permission_callback' => '__return_true'
        ]);
    }

    protected function registerLessonRoutes()
    {
        $controller = $this->getController('wolf-memberships.controller.lesson');
        $this->restRoutesHelper->createRoutes('wolf-memberships/v1', 'campaigns/(?P<campaign_id>[\d]+)/lessons', $controller);
    }

    protected function registerWheelRoutes()
    {
        $controller = $this->getController('wolf-memberships.controller.wheel');
        $this->restRoutesHelper->createRoutes('wolf-memberships/v1', 'wheels', $controller);
    }

    protected function registerWheelAssignmentRoutes()
    {
        $controller = $this->getController('wolf-memberships.controller.wheel_assignment');
        $this->restRoutesHelper->createRoutes('wolf-memberships/v1', 'members/(?P<member_id>[\d]+)/wheels', $controller);
    }

}