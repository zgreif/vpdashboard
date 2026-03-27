"use client";

import * as React from "react";
import { Edit2 } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { IncomeStatementTab } from "@/components/dashboard/IncomeStatementTab";
import { CashFlowTab } from "@/components/dashboard/CashFlowTab";
import { WorkingCapitalTab } from "@/components/dashboard/WorkingCapitalTab";
import { CustomersTab } from "@/components/dashboard/CustomersTab";
import { DataEditorModal } from "@/components/dashboard/DataEditorModal";
import { Button } from "@/components/ui/button";
import { useKpiData } from "@/hooks/useKpiData";
import { SAMPLE_CUSTOMER_DATA } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/calculations";

// ─── Types ────────────────────────────────────────────────────────────────────

type DashTab = "income" | "cashflow" | "nwc" | "customers";

const DASH_TABS: { id: DashTab; label: string }[] = [
  { id: "income",    label: "Income Statement" },
  { id: "cashflow",  label: "Cash Flow" },
  { id: "nwc",       label: "Working Capital" },
  { id: "customers", label: "Customers" },
];

// ─── View mode toggle (Monthly | LTM | Quarterly) ─────────────────────────────

function ViewModeToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const modes: { id: ViewMode; label: string }[] = [
    { id: "monthly",   label: "Monthly" },
    { id: "ltm",       label: "LTM" },
    { id: "quarterly", label: "Quarterly" },
  ];
  return (
    <div className="flex items-center rounded-md border bg-background overflow-hidden text-sm font-medium">
      {modes.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "px-3 py-1.5 transition-colors",
            value === id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Secondary tab bar ────────────────────────────────────────────────────────

function TabBar({
  active,
  onChange,
}: {
  active: DashTab;
  onChange: (t: DashTab) => void;
}) {
  return (
    <div className="border-b bg-background sticky top-14 z-20">
      <div className="flex items-stretch px-6 gap-0.5">
        {DASH_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "py-3 px-4 text-sm font-medium border-b-2 -mb-px transition-colors",
              active === id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data, metrics, viewMode, setViewMode, updateData, resetData } = useKpiData();
  const [activeTab, setActiveTab] = React.useState<DashTab>("income");

  return (
    <div className="flex flex-col flex-1">
      <TopNav
        actions={
          <>
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
            <DataEditorModal
              data={data}
              onSave={updateData}
              onReset={resetData}
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit Data
                </Button>
              }
            />
          </>
        }
      />

      <TabBar active={activeTab} onChange={setActiveTab} />

      <main className="flex-1 p-6">
        {activeTab === "income" && <IncomeStatementTab metrics={metrics} />}
        {activeTab === "cashflow" && <CashFlowTab metrics={metrics} />}
        {activeTab === "nwc" && <WorkingCapitalTab metrics={metrics} />}
        {activeTab === "customers" && (
          <CustomersTab data={SAMPLE_CUSTOMER_DATA} mode={viewMode} />
        )}
      </main>
    </div>
  );
}
