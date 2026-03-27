<?php

namespace Wolf\Memberships\Dashboard;

interface SourceBusInterface
{
    public function source(array $data = []): array;

}