import Button from "@mui/material/Button";
import { DataGridAction } from "../models/action";

export default function DataGridCellActions({
  actions,
  row,
}: {
  actions: DataGridAction<any>[];
  row: any;
}) {
  const handleActionClick = (action: DataGridAction<any>, row: any) => {
    if (action.handler) {
      action.handler(row);
    }
  };

  return (
    <div>
      {actions.map((action) => (
        <Button
          variant="outlined"
          key={action.name}
          onClick={() => handleActionClick(action, row)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
