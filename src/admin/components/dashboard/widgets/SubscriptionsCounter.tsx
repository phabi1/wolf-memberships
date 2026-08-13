import WidgetCounter from "../WidgetCounter";
import { useState, useEffect } from "react";
import SubscriptionService from "../../../services/subscriptions";

export default function DashboardWidgetSubscriptionsCounter({ settings }: any) {

    const [total, setTotal] = useState(0); // Replace with actual logic to fetch the total number of subscriptions

    useEffect(() => {
        SubscriptionService.count(settings.campaignId).then((data) => {
            setTotal(data);
        });
    }, [settings.campaignId]);

    return (
        <WidgetCounter title="Subscriptions" total={total} />
    );
}