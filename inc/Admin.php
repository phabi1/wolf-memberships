<?php

namespace Wolf\Memberships;

class Admin
{
    public function setup()
    {
        add_action('wolf_admin_menu', [$this, 'addAdminMenu']);
    }

    public function addAdminMenu()
    {
        add_submenu_page(
            'wolf',
            __('Membership', 'wolf-membership'),
            __('Membership', 'wolf-membership'),
            'manage_options',
            'wolf-memberships',
            [$this, 'renderPage'],
            70
        );
    }

    public function renderPage()
    {
        //include the index.assest.php file for taking the dependencies and               version
        $mfile = include(plugin_dir_path(__FILE__) . '../build/admin/index.asset.php');

        //enqueue the react built script
        wp_enqueue_script('wolf-events-admin', plugin_dir_url(__DIR__) . '/build/admin/index.js', $mfile['dependencies'], $mfile['version'], true);

        echo '<div id="app"></div>';
    }
}