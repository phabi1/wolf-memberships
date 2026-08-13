<?php

namespace Wolf\Memberships\Controller;

use Wolf\Core\Mvc\Controller\EntityController;
use Wolf\Core\UseCase\UseCaseBus;
use Wolf\Memberships\Entity\Service\MemberEntityService;

class MemberController extends EntityController
{
    private $useCaseBus;

    protected $entityName = 'wolf-memberships.member';

    public function __construct(UseCaseBus $useCaseBus, MemberEntityService $entityService)
    {
        $this->entityService = $entityService;
        $this->entityService->setEntityName($this->entityName);

        $this->useCaseBus = $useCaseBus;
    }

    public function existsAction($request)
    {
        $lastname = $request->get_param('lastname');
        if (!$lastname) {
            return new \WP_Error('lastname_required', 'Lastname parameter is required', ['status' => 400]);
        }

        $firstname = $request->get_param('firstname');
        if (!$firstname) {
            return new \WP_Error('firstname_required', 'Firstname parameter is required', ['status' => 400]);
        }

        $birthdate = $request->get_param('birthdate');
        if (!$birthdate) {
            return new \WP_Error('birthdate_required', 'Birthdate parameter is required', ['status' => 400]);
        }

        $exists = $this->useCaseBus->execute('wolf-memberships.exists_member', [
            'lastname' => $lastname,
            'firstname' => $firstname,
            'birthdate' => $birthdate
        ]);

        return [
            'exists' => $exists ? true : false,
            'id' => $exists ? $exists : null
        ];
    }

    public function generateHashAction($request)
    {
        $memberHelper = $this->getService('wolf-memberships.helper.member');
        $entityManager = $this->getService('wolf.entity.manager');
        $memberRepository = $entityManager->getRepository('wolf-memberships.member');
        $members = $memberRepository->find();

        foreach ($members as $member) {
            $hash = $memberHelper->generateHash($member->firstname, $member->lastname, $member->birthdate);
            $memberRepository->update($member->id, [
                'hash' => $hash
            ]);
        }
    }

    public function importAction($request)
    {
        $files = $request->get_file_params();
        if (empty($files['file'])) {
            throw new \WP_Error('file_not_provided', 'No file provided for import', ['status' => 400]);
        }

        $log = $this->useCaseBus->execute('wolf-memberships.import_members', [
            'file' => $files['file']['tmp_name']
        ]);

        return [
            'success' => true,
            'log' => $log
        ];
    }
}