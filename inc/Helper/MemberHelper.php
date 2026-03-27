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
        return md5(
            $this->stringHelper->slug($firstname) . ':' . $this->stringHelper->slug($lastname) . ':' . $birthdate
        );
    }
}