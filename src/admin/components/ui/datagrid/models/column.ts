export type DataGridColumn<T> = {
  name: string;
  header: string;
  type: "text" | "number" | "date" | "boolean" | "custom";
  data?: string;
  width?: number;
  renderCell?: (value: any, row: T) => React.ReactNode;
};
