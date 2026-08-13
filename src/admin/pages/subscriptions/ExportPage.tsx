import { useParams } from "react-router";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useEffect } from "react";
import SubscriptionService from "../../services/subscriptions";

export default function ExportPage() {
    const { campaignId } = useParams();

    useEffect(() => {
        if (!campaignId) {
            return;
        }
        SubscriptionService.export(campaignId).then((data) => {
            const url = window.URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `subscriptions_campaign_${campaignId}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }, [campaignId]);

    return (
        <Dialog open={true} onClose={() => { }}>
            <DialogContent>
                <div style={{ padding: 20 }}>
                    Exporting subscriptions for campaign {campaignId}...
                </div>
            </DialogContent>
        </Dialog>
    );
}