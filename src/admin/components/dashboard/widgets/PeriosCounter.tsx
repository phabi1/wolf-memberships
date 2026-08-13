import WidgetCounter from "../WidgetCounter";
import { useState, useEffect } from "react";
import PeriodService from "../../../services/periods";

export default function DashboardWidgetPeriodsCounter({ settings }: any) {

    const [total, setTotal] = useState(0); // Replace with actual logic to fetch the total number of periods

    useEffect(() => {
        PeriodService.count(settings.campaignId).then((data) => {
            setTotal(data);
        });
    }, [settings.campaignId]);

    return (
        <WidgetCounter title="Periods" total={total} />
    );
}