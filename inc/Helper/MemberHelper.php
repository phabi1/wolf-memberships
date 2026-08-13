<?php

namespace Wolf\Memberships\Helper;

use Wolf\Core\Helper\StringHelper;

class MemberHelper
{
    private $stringHelper;

    public function __construct(StringHelper $stringHelper)
    {
        $this->stringHelper = $stringHelper;
    }

    public function generateHash($firstname, $lastname, $birthdate)
    {
        if (is_int($birthdate)) {
            $birthdate = date('Y-m-d', $birthdate);
        } elseif ($birthdate instanceof \DateTime) {
            $birthdate = $birthdate->format('Y-m-d');
        } elseif (is_string($birthdate)) {
            // Assume it's already in the correct format
        } else {
            throw new \InvalidArgumentException('Birthdate must be a string, integer timestamp, or DateTime object');
        }
        return md5(
            $this->stringHelper->slug($firstname) . ':' . $this->stringHelper->slug($lastname) . ':' . $birthdate
        );
    }
}