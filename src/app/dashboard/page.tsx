"use client";

import * as React from "react";
import { Edit2 } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { DataEditorModal } from "@/components/dashboard/DataEditorModal";
import { ExcelUpload } from "@/components/dashboard/ExcelUpload";
import { Button } from "@/components/ui/button";
import { useKpiData } from "@/hooks/useKpiData";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/calculations";

/** Segmented LTM / Monthly toggle */
function ViewModeToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="flex items-center rounded-md border bg-background overflow-hidden text-sm font-medium">
      {(["ltm", "monthly"] as ViewMode[]).map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={cn(
            "px-3 py-1.5 transition-colors capitalize",
            value === mode
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {mode === "ltm" ? "LTM" : "Monthly"}
        </button>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data, metrics, viewMode, setViewMode, updateData, resetData } = useKpiData();

  return (
    <div className="flex flex-col flex-1">
      <TopNav
        actions={
          <>
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
            <ExcelUpload onUpload={updateData} />
            <DataEditorModal
              data={data}
              onSave={updateData}
              onReset={resetData}
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit data
                </Button>
              }
            />
          </>
        }
      />
      <main className="flex-1 p-6">
        <KpiGrid metrics={metrics} />
      </main>
    </div>
  );
}
