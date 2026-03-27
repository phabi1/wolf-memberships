import Paper from "@mui/material/Paper";
import { PropsWithChildren } from "react";

export type DashboardWidgetCardProps = PropsWithChildren<{
  title: string;
}>;

export default function DashboardWidgetCard({
  title,
  children,
}: DashboardWidgetCardProps) {
  return (
    <Paper style={{ padding: "16px", display: "flex", flexDirection: "column" }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div style={{ flexGrow: 1 }}>{children}</div>
    </Paper>
  );
}
