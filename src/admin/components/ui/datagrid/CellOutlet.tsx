import { useMemo } from "react";
import { DataGridColumn } from "./models/column";

export default function DataGridCellOutlet<T>({
  column,
  row,
}: {
  column: DataGridColumn<T>;
  row: T;
}) {
  const value = useMemo(() => {
    let field = column.data || column.name;
    if (field) {
      const keys = field.split(".");
      let val: any = row;
      for (const key of keys) {
        val = val?.[key];
        if (val === undefined) {
          break;
        }
      }
      return val;
    }
    return undefined;
  }, [column, row]);

  return (
    <div>
      {column.renderCell ? column.renderCell(value, row) : String(value)}
    </div>
  );
}
