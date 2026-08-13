import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export type DashboardWidgetCounterProps = {
    title: string;
    subtitle?: string;
    total: number;
};

export default function DashboardWidgetCounter({
    title,
    subtitle,
    total
}: DashboardWidgetCounterProps) {
    return (
        <Paper sx={{ height: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", height: "100%" }}>
                <Typography variant="h2" style={{ marginTop: 0, marginBottom: 0, padding: 16 }}>{total}</Typography>
                <Box>
                    <Typography variant="h6" style={{ marginTop: 0, marginBottom: 0, padding: 16 }}>{title}</Typography>
                    {subtitle && <Typography variant="subtitle1" style={{ marginTop: 0, marginBottom: 0, padding: 16 }}>{subtitle}</Typography>}
                </Box>
            </Box>
        </Paper>
    );
}
