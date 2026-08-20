<?php

namespace Wolf\Memberships\Activator;

class Uninstaller
{
    public function run()
    {
        $this->uninstall();
    }

    public function uninstall()
    {
        $this->dropTables();
        delete_option('wolf_membership_db_version');
    }

    protected function dropTables()
    {
        global $wpdb;
        $tables = [
            $wpdb->prefix . 'wolf_memberships_campaigns',
            $wpdb->prefix . 'wolf_memberships_lessons',
            $wpdb->prefix . 'wolf_memberships_sessions',
        ];

        foreach ($tables as $table) {
            $wpdb->query("DROP TABLE IF EXISTS {$table}");
        }
    }
}