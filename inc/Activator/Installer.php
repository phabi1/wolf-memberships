<?php

namespace Wolf\Memberships\Activator;

class Installer
{
    public function run()
    {
        $this->migrate();
    }

    public function migrate($installedVersion = 0)
    {
        foreach ($this->getMigrations() as $version => $migrationClass) {
            if (version_compare($installedVersion, $version, '<')) {
                $migration = new $migrationClass();
                $migration->up();
                update_option('wolf_membership_db_version', $version);
            }
        }
    }

    protected function getMigrations()
    {
        return [
            '1.0.0' => Migrations\Version_1_0_0::class,
        ];
    }
}