"use client";

import * as React from "react";
import { Edit2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { DataEditorModal } from "@/components/dashboard/DataEditorModal";
import { ExcelUpload } from "@/components/dashboard/ExcelUpload";
import { Button } from "@/components/ui/button";
import { useKpiData } from "@/hooks/useKpiData";

export default function DashboardPage() {
  const { data, metrics, updateData, resetData } = useKpiData();
  const latestMonth = data[data.length - 1]?.month;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header
        title="Dashboard"
        subtitle={latestMonth ? `As of ${latestMonth} (LTM)` : undefined}
        actions={
          <>
            <ExcelUpload onUpload={updateData} />
            <DataEditorModal
              data={data}
              onSave={updateData}
              onReset={resetData}
              trigger={
                <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
                  <Edit2 className="h-4 w-4" />
                  Edit data
                </Button>
              }
            />
          </>
        }
      />
      <main className="flex-1 p-6 overflow-auto">
        <KpiGrid metrics={metrics} />
      </main>
    </div>
  );
}
