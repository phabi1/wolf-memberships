<?php

namespace Wolf\Memberships\UseCase;

use Wolf\Core\Db\Db;
use Wolf\Core\UseCase\UseCaseInterface;

class GetLessonsCompletudeUseCase implements UseCaseInterface
{
    /**
     * @var Db
     */
    private $db;

    public function __construct(Db $db)
    {
        $this->db = $db;
    }

    public function execute(array $params = [])
    {
        $campaignId = $params['campaign_id'] ?? null;
        if (!$campaignId) {
            throw new \Exception("Campaign ID is required for GetLessonsCompletudeUseCase");
        }

        $results = $this->getSessions($campaignId);

        return array_map(function ($lesson) {
            $lesson->max_participants = (int) $lesson->max_participants;
            $lesson->total = (int) $lesson->total;
            $lesson->completude = $this->calculateCompletude($lesson->total, $lesson->max_participants);
            return $lesson;
        }, $results);
    }

    private function getSessions($campaignId)
    {
        $sql = $this->db->createQuery()
            ->select('l.id', 'id')
            ->select('l.title', 'title')
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
}