import { useState } from "react";
import ReactGridLayout, {
  useContainerWidth,
  verticalCompactor,
} from "react-grid-layout";
import DashboardWidgetOutlet from "../components/dashboard/WidgetOutlet";
import { useParams } from "react-router";


export default function DashboardPage() {
  const { campaignId } = useParams();
  const { width, containerRef, mounted } = useContainerWidth();
  const [layout] = useState<any[]>([
    {
      i: "1",
      x: 0,
      y: 0,
      w: 4,
      h: 2,
      type: "lessons-completude",
      settings: { campaignId },
    },
    {
      i: "2",
      x: 4,
      y: 0,
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
            gridConfig={{ cols: 12, rowHeight: 30 }}
            dragConfig={{ enabled: true, handle: ".handle" }}
            compactor={verticalCompactor}
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
