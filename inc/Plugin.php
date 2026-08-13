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

        $this->registerBlocks();
    }

    private function registerBlocks()
    {
        wp_register_block_types_from_metadata_collection(WOLF_MEMBERSHIP_PLUGIN_DIR . '/build', WOLF_MEMBERSHIP_PLUGIN_DIR . '/build/blocks-manifest.php');
    }
}