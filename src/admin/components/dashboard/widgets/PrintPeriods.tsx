import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardWidgetCard from "../WidgetCard";

export default function DashboardWidgetPrintPeriods({ settings }: any) {
  const [periods, setPeriods] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const canPrint = useMemo(() => selectedPeriod !== "", [selectedPeriod]);

  const handleSelectChange = (event: any) => {
    setSelectedPeriod(event.target.value as string);
  };

  const handlePrint = useCallback(() => {
    if (!canPrint) return;

    const campaignId = settings.campaignId;

    fetch(`/wp-json/wolf-memberships/v1/campaigns/${campaignId}/periods/${selectedPeriod}/print`, {
      method: "POST",
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `period_${selectedPeriod}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }, [canPrint, selectedPeriod, settings.campaignId]);

  useEffect(() => {
    fetch(
      "/wp-json/wolf-memberships/v1/dashboard/source?type=get_periods_for_print&campaign_id=" +
      settings.campaignId,
    )
      .then((res) => res.json())
      .then((data) => {
        setPeriods(data.periods);
      });
  }, [settings.campaignId]);

  return (
    <DashboardWidgetCard title="Print Periods">
      <div style={{ marginBottom: "16px" }}>
        <Select value={selectedPeriod} onChange={handleSelectChange} fullWidth>
          <MenuItem value="">Select a period</MenuItem>
          {periods.map((period) => (
            <MenuItem key={period.id} value={period.id}>
              {period.title}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!canPrint}
          onClick={handlePrint}
        >
          Print
        </Button>
      </div>
    </DashboardWidgetCard>
  );
}
