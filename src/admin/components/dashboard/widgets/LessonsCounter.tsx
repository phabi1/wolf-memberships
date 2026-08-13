import WidgetCounter from "../WidgetCounter";
import { useState, useEffect } from "react";
import LessonService from "../../../services/lessons";

export default function DashboardWidgetLessonsCounter({ settings }: any) {

    const [total, setTotal] = useState(0); // Replace with actual logic to fetch the total number of lessons

    useEffect(() => {
        LessonService.count(settings.campaignId).then((data) => {
            setTotal(data);
        });
    }, [settings.campaignId]);

    return (
        <WidgetCounter title="Lessons" total={total} />
    );
}