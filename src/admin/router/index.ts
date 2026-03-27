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
        path: "members",
        Component: lazy(() => import("../pages/members/ListPage.tsx")),
        children: [
          {
            path: "new",
            Component: lazy(() => import("../pages/members/AddPage.tsx")),
          },
          {
            path: ":memberId/edit",
            Component: lazy(() => import("../pages/members/EditPage.tsx")),
          },
        ],
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
