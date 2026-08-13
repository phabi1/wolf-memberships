import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useEffect, useReducer } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import DataGrid from "../../components/ui/Datagrid";
import Page from "../../components/ui/Page";
import { DataGridColumn } from "../../components/ui/datagrid/models/column";
import { Subscription } from "../../models/subscription";
import SubscriptionService from "../../services/subscriptions";
import Avatar from "@mui/material/Avatar";
import { MemberAvatar } from "../../components/ui/Avatar";

type State = {
  loading: boolean;
  items: Subscription[];
  total: number;
  filters: Record<string, string>;
  pagination: {
    page: number;
    size: number;
  };
  selection: { id: number; title: string }[];
};

type Action =
  | {
    type: "fetchItems";
    payload: { items: Subscription[]; total: number };
  }
  | {
    type: "setLoading";
    payload: boolean;
  }
  | {
    type: "setFilters";
    payload: Record<string, string>;
  }
  | {
    type: "setPagination";
    payload: { page: number; size: number };
  }
  | {
    type: "setSelection";
    payload: { id: number; title: string }[];
  };

export default function MemberListPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const pageActions = [
    {
      name: "add",
      label: "Add Member",
      handler: () => navigate(`/campaign/${campaignId}/subscriptions/new`),
    },
    {
      name: "import",
      label: "Import Members",
      handler: () => navigate(`/campaign/${campaignId}/subscriptions/import`),
    },
    {
      name: "export",
      label: "Export Members",
      handler: () => navigate(`/campaign/${campaignId}/subscriptions/export`),
    }
  ];

  const [state, dispatch] = useReducer(
    (state: State, action: Action) => {
      switch (action.type) {
        case "setLoading":
          return { ...state, loading: action.payload };
        case "fetchItems":
          return {
            ...state,
            items: action.payload.items,
            total: action.payload.total,
          };
        case "setFilters":
          return {
            ...state,
            filters: { ...state.filters, ...action.payload },
            pagination: { ...state.pagination, page: 0 },
          };
        case "setPagination":
          return {
            ...state,
            pagination: { ...state.pagination, ...action.payload },
          };
        case "setSelection":
          return {
            ...state,
            selection: action.payload,
          };
        default:
          return state;
      }
    },
    {
      items: [],
      total: 0,
      loading: false,
      filters: {
        "member.firstname": "",
        "member.lastname": "",
        "member.license": "",
      },
      pagination: { page: 0, size: 20 },
      selection: [],
    },
  );

  const columns: DataGridColumn<Subscription>[] = [
    { name: "id", header: "ID", width: 70, type: "number" },
    { name: "avatar", header: "Avatar", width: 100, type: "custom", data: "member.avatar_url", renderCell: (value: any, row: Subscription) => {
        return <MemberAvatar url={row.member.avatar_url} gender={row.member.gender} />;
      },
    },
    {
      name: "firstname",
      header: "First Name",
      type: "text",
      data: "member.firstname",
    },
    {
      name: "lastname",
      header: "Last Name",
      type: "text",
      data: "member.lastname",
    },
    {
      name: "birthdate",
      header: "Birthdate",
      type: "date",
      data: "member.birthdate",
      renderCell: (value: any, row: Subscription) => {
        if (!value) {
          return "";
        }
        const date = new Date(value);
        return date.toLocaleDateString();
      },
    },
    {
      name: "license_number",
      header: "License Number",
      type: "text",
      data: "member.license_number",
    },
    {
      name: "license_type",
      header: "License Type",
      type: "text",
      data: "member.license_type",
    },
  ];

  const rowActions = [
    {
      name: "edit",
      label: "Edit",
      handler: (row: Subscription) => navigate(`/campaign/${campaignId}/subscriptions/${row.id}/edit`),
    },
  ];

  useEffect(() => {
    dispatch({ type: "setLoading", payload: true });
    SubscriptionService.items(campaignId!, {
      page: state.pagination.page + 1,
      size: state.pagination.size,
      filters: { ...state.filters },
    }).then((data: { items: Subscription[]; total: number }) => {
      dispatch({ type: "fetchItems", payload: data });
      dispatch({ type: "setLoading", payload: false });
    });
  }, [campaignId, state.filters, state.pagination]);

  const handlePaginationChange = (model: any) => {
    const { page, pageSize } = model;
    dispatch({ type: "setPagination", payload: { page, size: pageSize } });
  };

  const handleFilterChange = (field: string, value: string) => {
    dispatch({ type: "setFilters", payload: { [field]: value } });
  };

  return (
    <>
      <div className="wrap">
        <Page title="Members" actions={pageActions}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <Box sx={{ display: "flex", p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 2,
                  flex: 1,
                  gap: 2,
                }}
              >
                <TextField
                  label="Firstname"
                  variant="outlined"
                  onChange={(event) =>
                    handleFilterChange("member.firstname", event.target.value)
                  }
                />
                <TextField
                  label="Lastname"
                  variant="outlined"
                  onChange={(event) =>
                    handleFilterChange("member.lastname", event.target.value)
                  }
                />
                <TextField
                  label="License"
                  variant="outlined"
                  onChange={(event) =>
                    handleFilterChange("member.license", event.target.value)
                  }
                />
              </Box>
            </Box>
          </Paper>

          {state.selection.length > 0 && (
            <div>
              <h2>Selected Members</h2>
              <div>
                {state.selection.map((member) => (
                  <Chip key={member.id} label={member.title} />
                ))}
              </div>
            </div>
          )}

          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={state.items}
              total={state.total}
              loading={state.loading}
              columns={columns}
              rowActions={rowActions}
              page={state.pagination.page}
              pageSize={state.pagination.size}
              onPaginationChange={({ page, pageSize }) =>
                dispatch({
                  type: "setPagination",
                  payload: { page, size: pageSize },
                })
              }
            />
          </Paper>
        </Page>
      </div>
      <Outlet />
    </>
  );
}
