<?php

namespace Wolf\Memberships\Activator\Migrations;

class Version_1_0_0
{
    public function up()
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'wolf_membership_subscriptions';

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            license_type VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            address_line1 VARCHAR(255) NOT NULL,
            address_line2 VARCHAR(255),
            city VARCHAR(255) NOT NULL,
            postal_code VARCHAR(20) NOT NULL,
            country VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            email VARCHAR(255) NOT NULL,
            fields JSON,
            subscribed_at DATETIME NOT NULL,
            campaign_id BIGINT(20) UNSIGNED NOT NULL,
            member_id BIGINT(20) UNSIGNED NOT NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}