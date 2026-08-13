import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { PropsWithChildren } from "react";

export type DashboardWidgetCardProps = PropsWithChildren<{
  title: string;
}>;

export default function DashboardWidgetCard({
  title,
  children,
}: DashboardWidgetCardProps) {
  return (
    <Paper sx={{ height: "100%" }}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ padding: 2, borderBottom: "1px solid #eee" }}>
          <Typography variant="h6" style={{ marginTop: 0, marginBottom: 0 }}>{title}</Typography>
        </Box>
        <Box sx={{ padding: 2, flexGrow: 1, overflow: "auto" }}>{children}</Box>
      </Box>
    </Paper>
  );
}
