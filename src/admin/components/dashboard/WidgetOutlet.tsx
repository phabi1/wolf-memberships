import { lazy, Suspense } from "react";

const DASHBOARD_WIDGETS = {
  "lessons-completude": lazy(() => import("./widgets/LessonsCompletude.tsx")),
  "print-periods": lazy(() => import("./widgets/PrintPeriods.tsx")),
  "subscriptions-overview": lazy(() => import("./widgets/SubscriptionsOverview.tsx")),
  'subscriptions-counter': lazy(() => import("./widgets/SubscriptionsCounter.tsx")),
  'lessons-counter': lazy(() => import("./widgets/LessonsCounter.tsx")),
  'periods-counter': lazy(() => import("./widgets/PeriosCounter.tsx")),
};

interface DashboardWidgetOutletProps {
  type: keyof typeof DASHBOARD_WIDGETS;
  settings?: Record<string, unknown>;
}

export default function DashboardWidgetOutlet({
  type,
  settings,
}: DashboardWidgetOutletProps) {
  const WidgetComponent = DASHBOARD_WIDGETS[type];

  return (
      <Suspense fallback={<div>Loading...</div>}>
        <WidgetComponent settings={settings} />
      </Suspense>
  );
}
