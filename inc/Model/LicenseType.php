<?php

namespace Wolf\Memberships\Model;

class LicenseType
{
    const HOBBY = 'hobby';
    const COMPETITION = 'competition';

    public static function getAllTypes(): array
    {
        return [
            self::HOBBY,
            self::COMPETITION,
        ];
    }

    public static function isValidType(string $type): bool
    {
        return in_array($type, self::getAllTypes(), true);
    }
}