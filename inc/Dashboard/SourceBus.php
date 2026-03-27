<?php

namespace Wolf\Memberships\Dashboard;

use Wolf\Core\Di\ContainerAwareInterface;
use Wolf\Core\Di\ContainerAwareTrait;
use Wolf\Core\Di\Locator;

class SourceBus implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    private $_locator;

    public function execute($type, array $data = [])
    {
        $locator = $this->getLocator();
        $source = $locator->get($type);
        if (!$source) {
            throw new \Exception("Source $type not found");
        }
        return $source->source($data);
    }

    private function getLocator()
    {
        if (!$this->_locator) {
            $this->_locator = new Locator('wolf-memberships.dashboard.source');
            $this->_locator->setContainer($this->container);
        }
        return $this->_locator;
    }
}