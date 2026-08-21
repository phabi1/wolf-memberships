import { useReducer, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import RequestService from "../../services/requests";
import Page, { Action as PageAction } from "../../components/ui/Page";
import { Request } from "../../models/request";
import { PayerCard } from "../../components/requests/PayerCard";
import { ParticipantsCard } from "../../components/requests/ParticipantsCard";

interface State {
    item: Request | null;
    loading: boolean;
}

type Action =
    | {
        type: "fetchItem";
        payload: Request;
    }
    | {
        type: "setLoading";
        payload: boolean;
    }
    ;

export default function RequestDetailsPage() {
    const { campaignId, requestId } = useParams();
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(
        (state: State, action: Action) => {
            switch (action.type) {
                case "setLoading":
                    return { ...state, loading: action.payload };
                case "fetchItem":
                    return {
                        ...state,
                        item: action.payload,
                    };
                default:
                    return state;
            }
        },
        {
            item: null,
            loading: false,
        },
    );

    useEffect(() => {
        if (!campaignId || !requestId) {
            return;
        }

        dispatch({ type: "setLoading", payload: true });
        RequestService.item(campaignId, requestId)
            .then((item) => {
                dispatch({ type: "fetchItem", payload: item });
            })
            .finally(() => {
                dispatch({ type: "setLoading", payload: false });
            });
    }, [campaignId, requestId]);

    const pageActions = useMemo<PageAction[]>(() => {
        if (state.loading || !state.item) {
            return [];
        }
        if (state.item.status === "pending") {
            return [
                {
                    name: "approve",
                    label: "Approve",
                    primary: true,
                    handler: async () => {
                        if (!campaignId || !requestId) {
                            return;
                        }
                        try {
                            await RequestService.approve(campaignId, requestId);
                            dispatch({ type: "fetchItem", payload: { ...state.item!, status: "approved" } });
                        } catch (error) {
                            console.error("Error approving request:", error);
                        }
                    },
                },
                {
                    name: "reject",
                    label: "Reject",
                    handler: async () => {
                        if (!campaignId || !requestId) {
                            return;
                        }
                        try {
                            await RequestService.reject(campaignId, requestId);
                            dispatch({ type: "fetchItem", payload: { ...state.item!, status: "rejected" } });
                        } catch (error) {
                            console.error("Error rejecting request:", error);
                        }
                    },
                },
            ];
        } else if (state.item.status === "approved") {
            return [
                {
                    name: "paid",
                    label: "Mark as Paid",
                    handler: async () => {
                        if (!campaignId || !requestId) {
                            return;
                        }
                        try {
                            await RequestService.paid(campaignId, requestId);
                            dispatch({ type: "fetchItem", payload: { ...state.item!, status: "paid" } });
                        } catch (error) {
                            console.error("Error marking request as paid:", error);
                        }
                    },
                },
            ];
        } else {
            return [

            ];
        }
    }, [state.item]);

    if (state.loading) {
        return <div>Loading...</div>;
    }

    if (!state.item) {
        return <div>No request found.</div>;
    }

    return (
        <Page title={`Request Details - ${state.item.id}`} actions={pageActions}>
            <PayerCard request={state.item} />
            <ParticipantsCard participants={state.item.data.participants} />
        </Page>
    );
}