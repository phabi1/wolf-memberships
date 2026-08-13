import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState, useMemo } from "react";
import DashboardWidgetCard from "../WidgetCard";

interface Lesson {
  id: number;
  title: string;
  max_participants: number;
  total: number;
  completude: number;
}

export default function DashboardWidgetLessonsCompletude({ settings }: any) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const empty = useMemo(() => {
    if (loading) return false;
    return lessons.length === 0;
  }, [lessons, loading]);

  useEffect(() => {
    fetch(
      "/wp-json/wolf-memberships/v1/dashboard/source?type=lessons_completude&campaign_id=" + settings.campaignId,
    )
      .then((res) => res.json())
      .then((data) => {
        setLessons(
          data.sessions.map((session: any) => ({
            id: session.id,
            title: session.title,
            max_participants: session.max_participants,
            total: session.total,
            completude: session.completude,
          })),
        );

        setLoading(false);
      });
  }, [settings.campaignId]);

  return (
    <DashboardWidgetCard title="Lessons Completude">
      {loading ? <p>Loading...</p> : null}
      {empty ? <p>No lessons available</p> : (
        <ul>
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              {lesson.title}{" "}
              <span style={{ fontSize: "0.8em", color: "#666" }}>
                ({lesson.total}/{lesson.max_participants})
              </span>
              <LinearProgress variant="determinate" value={lesson.completude} />
            </li>
          ))}
        </ul>
      )}
    </DashboardWidgetCard>
  );
}
