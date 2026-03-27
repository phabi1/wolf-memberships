<?php

namespace Wolf\Memberships;

class Plugin
{

    public function run()
    {
        add_action('init', [$this, 'init']);
    }

    public function init()
    {
        $admin = new Admin();
        $admin->setup();

        $api = new Api();
        $api->setup();
    }
}