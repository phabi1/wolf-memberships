import { useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function DataGridPagination({
  page,
  pageSize,
  total,
  onPaginationChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => void;
}) {
  const canPrevious = useMemo(() => page > 0, [page]);
  const canNext = useMemo(
    () => (page + 1) * pageSize < total,
    [page, pageSize, total],
  );

  const handlePageChange = (newPage: number) => {
    onPaginationChange({ page: newPage, pageSize });
  };


  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Button disabled={!canPrevious} onClick={() => handlePageChange(page - 1)}>
        Previous
      </Button>
      <Button disabled={!canNext} onClick={() => handlePageChange(page + 1)}>
        Next
      </Button>
    </Box>
  );
}
