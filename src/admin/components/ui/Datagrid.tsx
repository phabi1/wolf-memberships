import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useMemo } from "react";
import DataGridCellActions from "./datagrid/cell/Axtions";
import { DataGridAction } from "./datagrid/models/action";
import { DataGridColumn } from "./datagrid/models/column";
import DataGridPagination from "./datagrid/Pagination";
import DataGridCellOutlet from "./datagrid/CellOutlet";

export type DataGridOptions<T> = {
  columns: DataGridColumn<T>[];
  rows: T[];
  total: number;
  rowActions?: DataGridAction<T>[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  onPaginationChange?: ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => void;
  onSelectionChange?: (selection: T[]) => void;
};

export default function DataGrid<T>(options: DataGridOptions<T>) {
  const actionColumn = useMemo<DataGridColumn<T> | null>(() => {
    if (!options.rowActions || options.rowActions.length === 0) {
      return null;
    }
    return {
      name: "__actions",
      header: "Actions",
      type: "custom",
      width: 200,
      renderCell: (value: any, row: T) => (
        <DataGridCellActions actions={options.rowActions!} row={row} />
      ),
    };
  }, [options.rowActions]);

  const displayedColumns = useMemo<DataGridColumn<T>[]>(() => {
    const columns = [...options.columns];
    if (actionColumn) {
      columns.push(actionColumn);
    }
    return columns;
  }, [options.columns, actionColumn]);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {displayedColumns.map((col) => (
                <TableCell key={col.name} style={{ width: col.width }}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {options.loading ? (
              <TableRow>
                <TableCell colSpan={displayedColumns.length} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : null}
            {options.rows.length === 0 && !options.loading ? (
              <TableRow>
                <TableCell colSpan={displayedColumns.length} align="center">
                  No data
                </TableCell>
              </TableRow>
            ) : (
              options.rows.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => options.onRowClick?.(row)}
                >
                  {displayedColumns.map((col) => (
                    <TableCell key={col.name} style={{ width: col.width }}>
                      <DataGridCellOutlet column={col} row={row} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <DataGridPagination
        page={options.page || 0}
        pageSize={options.pageSize || 10}
        total={options.total}
        onPaginationChange={(event) =>
          options.onPaginationChange?.({
            page: event.page,
            pageSize: event.pageSize,
          })
        }
      />
    </Paper>
  );
}
