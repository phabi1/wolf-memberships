<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\Db\Db;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Helper\DateHelper;

class GetLessonsCompletudeUseCase implements UseCaseInterface
{
    /**
     * @var Db
     */
    private $db;

    private $dateHelper;

    public function __construct(Db $db, DateHelper $dateHelper)
    {
        $this->db = $db;
        $this->dateHelper = $dateHelper;
    }

    public function execute(array $params = [])
    {
        $campaignId = $params['campaign_id'] ?? null;
        if (!$campaignId) {
            throw new \Exception("Campaign ID is required for GetLessonsCompletudeUseCase");
        }

        $sessions = $this->getSessions($campaignId);

        usort($sessions, function ($a, $b) {
            if ($a->day === $b->day) {
                return strtotime($a->lesson_start) <=> strtotime($b->lesson_start);
            }
            return $a->day <=> $b->day;
        });

        return array_map(function ($lesson) {
            return [
                'id' => $lesson->id,
                'title' => $this->buildTitle($lesson),
                'max_participants' => (int) $lesson->max_participants,
                'total' => (int) $lesson->total,
                'completude' => $this->calculateCompletude((int) $lesson->total, (int) $lesson->max_participants),
            ];
        }, $sessions);
    }

    private function getSessions($campaignId)
    {
        $sql = $this->db->createQuery()
            ->select('l.id', 'id')
            ->select('l.title', 'name')
            ->select('l.day', 'day')
            ->select('l.lesson_start', 'lesson_start')
            ->select('l.lesson_end', 'lesson_end')
            ->select('l.participant_max', 'max_participants')
            ->select('COUNT(s.lesson_id)', 'total')
            ->from('wolf_memberships_lesson', 'l')
            ->leftJoin('wolf_memberships_session', 's', 's.lesson_id = l.id')
            ->where($this->db->expr()->eq('l.campaign_id', $campaignId))
            ->groupBy('l.id');

        return $this->db->rows($sql);
    }

    private function calculateCompletude($total, $maxParticipants)
    {
        if ($maxParticipants == 0) {
            return 0;
        }
        return round(($total / $maxParticipants) * 100, 2);
    }

    private function buildTitle($lesson)
    {
        $day = $this->dateHelper->formatDay($lesson->day);
        $startTime = date('H:i', strtotime($lesson->lesson_start));
        $endTime = date('H:i', strtotime($lesson->lesson_end));
        return "{$day} - {$startTime} à {$endTime}";
    }
}