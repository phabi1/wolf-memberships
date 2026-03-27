<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Memberships\Entity\Repository\MemberEntityRepository;
use Wolf\Memberships\Helper\MemberHelper;

class ExistsMemberUseCase implements UseCaseInterface
{
    private MemberEntityRepository $memberRepository;

    private MemberHelper $memberHelper;

    public function __construct(EntityManager $entityManager, MemberHelper $memberHelper)
    {
        $memberRepository = $entityManager->getRepository('wolf-memberships.member');
        if (!$memberRepository instanceof MemberEntityRepository) {
            throw new \RuntimeException('Expected repository of type MemberEntityRepository');
        }
        $this->memberRepository = $memberRepository;
        $this->memberHelper = $memberHelper;
    }

    public function execute(array $data = [])
    {
        $lastname = $data['lastname'] ?? null;
        $firstname = $data['firstname'] ?? null;
        $birthdate = $data['birthdate'] ?? null;

        if (!$lastname || !$firstname || !$birthdate) {
            throw new \InvalidArgumentException('Lastname, firstname and birthdate are required');
        }

        $hash = $this->memberHelper->generateHash($lastname, $firstname, $birthdate);
        return $this->memberRepository->existsHash($hash);
    }
}