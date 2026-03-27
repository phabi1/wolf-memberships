export type DataGridAction<T> = {
  name: string;
  label: string;
  handler?: (row: T) => void;
};
