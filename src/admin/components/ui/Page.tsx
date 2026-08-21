import Box from "@mui/material/Box";
import { PropsWithChildren, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export type Action = {
  name: string;
  label: string;
  primary?: boolean;
  handler?: () => void;
};

export type PageProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  actions?: Action[];
  topAction?: React.ReactNode;
}>;

function PageActions({ actions }: { actions: Action[] }) {
  const primaryActions = useMemo(() => actions.filter((action) => action.primary), [actions]);

  const hasPrimaryActions = useMemo(
    () => primaryActions.length > 0,
    [primaryActions],
  );

  const secondaryActions = useMemo(
    () => actions.filter((action) => !action.primary),
    [actions],
  );

  const hasSecondaryAction = useMemo(
    () => secondaryActions.length > 0,
    [secondaryActions],
  );

  const handleActionClick = (action: Action) => {
    if (action.handler) {
      action.handler();
    }
  };

  return (
    <div>
      {hasPrimaryActions && primaryActions.map((action) => (
        <Button
          key={action.name}
          variant="contained"
          onClick={() => handleActionClick(action)}
        >
          {action.label}
        </Button>
      ))}
      {hasSecondaryAction &&
        secondaryActions.map((action) => (
          <Button key={action.name} onClick={() => handleActionClick(action)}>
            {action.label}
          </Button>
        ))}
    </div>
  );
}

function PageHeader({
  title,
  subtitle,
  actions,
  topAction,
}: {
  title: string;
  subtitle?: string;
  actions?: Action[];
}) {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", gap: 4, mb: 4 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" gutterBottom>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <PageActions actions={actions} />}
    </Box>
  );
}

export default function Page({
  title,
  subtitle,
  actions,
  topAction,
  children,
}: PageProps) {
  return (
    <div>
      {topAction && <div>{topAction}</div>}
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      <div>{children}</div>
    </div>
  );
}
