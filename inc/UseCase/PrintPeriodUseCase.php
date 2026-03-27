<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\Entity\EntityRepository;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Memberships\Print\PresenceList;

class PrintPeriodUseCase implements UseCaseInterface
{
    /**
     * Summary of PeriodRepository
     * @var EntityRepository
     */
    private EntityRepository $periodRepository;

    /**
     * Summary of lessonRepository
     * @var EntityRepository
     */
    private EntityRepository $lessonRepository;

    private EntityRepository $sessionRepository;

    /**
     * Summary of MemberRepository
     * @var EntityRepository
     */
    private EntityRepository $memberRepository;
    private EntityRepository $contactRepository;


    public function __construct(EntityManager $entityManager)
    {
        $this->periodRepository = $entityManager->getRepository('wolf-memberships.period');
        $this->lessonRepository = $entityManager->getRepository('wolf-memberships.lesson');
        $this->sessionRepository = $entityManager->getRepository('wolf-memberships.session');
        $this->memberRepository = $entityManager->getRepository('wolf-memberships.member');
        $this->contactRepository = $entityManager->getRepository('wolf-memberships.contact');
    }

    public function execute(array $params = [])
    {
        $periodId = $params['id'];
        $period = $this->periodRepository->findById($periodId);
        $lessons = $this->lessonRepository->find([
            'campaign_id' => ['eq' => $period->campaign_id],
        ]);

        $sessions = $this->sessionRepository->find([
            'campaign_id' => ['eq' => $period->campaign_id],
        ]);

        $memberIds = array_unique(array_map(function ($session) {
            return $session->member_id;
        }, $sessions));

        $members = array_reduce($this->memberRepository->find([
            'id' => [
                'in' => $memberIds
            ],
        ]), function ($carry, $member) {
            $carry[$member->id] = $member;
            return $carry;
        }, []);

        $contacts = $this->contactRepository->find([
            'member_id' => [
                'in' => $memberIds
            ],
        ]);

        foreach ($contacts as $contact) {
            if (isset($members[$contact->member_id])) {
                $members[$contact->member_id]->phone = $contact->phone;
            }
        }

        $membersByLessons = [];

        foreach ($lessons as $lesson) {
            $membersByLessons[$lesson->id] = array_map(function ($session) use ($members) {
                return $members[$session->member_id] ?? null;
            }, array_filter($sessions, function ($session) use ($lesson) {
                return $session->lesson_id === $lesson->id;
            }));
        }

        foreach ($membersByLessons as $lessonId => $members) {
            usort($members, function ($a, $b) {
                return strcmp($a->lastname . ' ' . $a->firstname, $b->lastname . ' ' . $b->firstname);
            });
            $membersByLessons[$lessonId] = $members;
        }

        $pdf = new PresenceList();
        $pdf->setLessons($lessons);
        $pdf->setMembers($membersByLessons);


        $pdfContent = $pdf->render();
        return [
            'pdf' => base64_encode($pdfContent),
            'filename' => $this->generateFilename($period)
        ];
    }

    protected function generateFilename($period)
    {
        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $period->title);
        return $filename . '.pdf';
    }
}