import { createHashRouter } from "react-router";
import { lazy } from "react";
import LayoutCampaign from "../layouts/Campaign.tsx";

export const router = createHashRouter([
  {
    path: "/",
    Component: lazy(() => import("../pages/HomePage.tsx")),
  },
  {
    path: "/campaign/:campaignId",
    Component: LayoutCampaign,
    children: [
      {
        path: "",
        Component: lazy(() => import("../pages/DashboardPage.tsx")),
      },
      {
        path: "subscriptions",
        Component: lazy(() => import("../pages/subscriptions/ListPage.tsx")),
        children: [
          {
            path: "new",
            Component: lazy(() => import("../pages/subscriptions/AddPage.tsx")),
          },

          {
            path: "import",
            Component: lazy(
              () => import("../pages/subscriptions/ImportPage.tsx"),
            ),
          },
          {
            path: "export",
            Component: lazy(
              () => import("../pages/subscriptions/ExportPage.tsx"),
            ),
          },
        ],
      },
      {
        path: "subscriptions/:subscriptionId/edit",
        Component: lazy(() => import("../pages/subscriptions/DetailsPage.tsx")),
      },
      {
        path: "lessons",
        Component: lazy(() => import("../pages/lessons/ListPage.tsx")),
        children: [],
      },
      {
        path: "periods",
        Component: lazy(() => import("../pages/periods/ListPage.tsx")),
        children: [
          {
            path: "new",
            Component: lazy(() => import("../pages/periods/FormPage.tsx")),
          },
          {
            path: ":periodId/edit",
            Component: lazy(() => import("../pages/periods/FormPage.tsx")),
          },
        ],
      },
    ],
  },
]);
