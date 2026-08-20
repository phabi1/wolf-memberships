<?php

namespace Wolf\Memberships;

class Plugin
{

    public function run()
    {


        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);

        add_action('init', [$this, 'init']);

        add_action('plugins_loaded', [$this, 'checkDbVersion']);
    }

    public function init()
    {
        $admin = new Admin();
        $admin->setup();

        $api = new Api();
        $api->setup();

        $this->registerBlocks();
    }

    public function activate()
    {
        $installer = new Activator\Installer();
        $installer->run();
    }

    public function deactivate()
    {
        $uninstaller = new Activator\Uninstaller();
        $uninstaller->run();
    }

    private function registerBlocks()
    {
        wp_register_block_types_from_metadata_collection(WOLF_MEMBERSHIP_PLUGIN_DIR . '/build', WOLF_MEMBERSHIP_PLUGIN_DIR . '/build/blocks-manifest.php');
    }
    public function checkDbVersion()
    {
        $installedVersion = get_option('wolf_membership_db_version', 0);
        if (version_compare($installedVersion, WOLF_MEMBERSHIP_DB_VERSION, '<')) {
            $installer = new Activator\Installer();
            $installer->migrate($installedVersion);
        }
    }
}