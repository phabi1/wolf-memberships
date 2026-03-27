import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import DataGrid from "../../components/ui/Datagrid";
import Page from "../../components/ui/Page";
import PeriodService from "../../services/periods";
import { DataGridColumn } from "../../components/ui/datagrid/models/column";
import { DataGridAction } from "../../components/ui/datagrid/models/action";

export default function PeriodListPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const pageActions = [
    {
      name: "add",
      label: "Add Period",
      handler: () => navigate(`/campaigns/${campaignId}/periods/add`),
    },
  ];

  const columns: DataGridColumn<any>[] = [
    { name: "id", header: "ID", type: "number" },
    { name: "title", header: "Title", type: "text" },
    { name: "start_date", header: "Start Date", type: "date" },
    { name: "end_date", header: "End Date", type: "date" },
  ];

  const [rows, setRows] = useState<any[]>([]);

  const rowActions: DataGridAction<any>[] = [
    {
      name: "edit",
      label: "Edit",
      handler: (row) => {
        // Handle edit action, e.g., navigate to edit page
        navigate(`/campaigns/${campaignId}/periods/${row.id}/edit`);
      },
    },
    {
      name: "delete",
      label: "Delete",
      handler: (row) => {
        // Handle delete action, e.g., show confirmation dialog
      },
    },
  ];

  useEffect(() => {
    PeriodService.items(campaignId!).then((data: { items: any[] }) => {
      setRows(data.items);
    });
  }, [campaignId]);

  return (
    <Page title="Periods" actions={pageActions}>
      <DataGrid
        columns={columns}
        rows={rows}
        total={rows.length}
        rowActions={rowActions}
      ></DataGrid>
    </Page>
  );
}
