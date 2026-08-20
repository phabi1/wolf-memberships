import { useState } from "react";
import ReactGridLayout, {
  useContainerWidth,
  verticalCompactor,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import DashboardWidgetOutlet from "../components/dashboard/WidgetOutlet";
import { useParams } from "react-router";


export default function DashboardPage() {
  const { campaignId } = useParams();
  const { width, containerRef, mounted } = useContainerWidth();
  const [layout] = useState<any[]>([
    {
      i: "3",
      x: 0,
      y: 0,
      w: 4,
      h: 1,
      type: "subscriptions-counter",
      settings: { campaignId },
    },
    {
      i: "4",
      x: 4,
      y: 0,
      w: 4,
      h: 1,
      type: "lessons-counter",
      settings: { campaignId },
    },
    {
      i: "5",
      x: 8,
      y: 0,
      w: 4,
      h: 1,
      type: "periods-counter",
      settings: { campaignId },
    },
    {
      i: "1",
      x: 4,
      y: 2,
      w: 4,
      h: 6,
      type: "lessons-completude",
      settings: { campaignId },
    },
    {
      i: "2",
      x: 8,
      y: 2,
      w: 4,
      h: 2,
      type: "print-periods",
      settings: { campaignId },
    },
  ]);
  return (
    <>
      <h1>Dashboard</h1>
      <div ref={containerRef as React.LegacyRef<HTMLDivElement>}>
        {mounted && (
          <ReactGridLayout
            width={width}
            layout={layout}
            gridConfig={{ cols: 12, rowHeight: 112, margin: [16, 16] }}
            dragConfig={{ enabled: false, handle: ".handle" }}
            className="layout"
          >
            {layout.map((item) => (
              <div key={item.i}>
                <DashboardWidgetOutlet
                  type={item.type}
                  settings={item.settings}
                />
              </div>
            ))}
          </ReactGridLayout>
        )}
      </div>
    </>
  );
}
