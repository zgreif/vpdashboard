import * as React from "react";
import { KpiCard } from "@/components/charts/KpiCard";
import type { KpiMetric } from "@/types";

interface IncomeStatementTabProps {
  metrics: KpiMetric[];
}

export function IncomeStatementTab({ metrics }: IncomeStatementTabProps) {
  const tabMetrics = metrics.filter((m) => m.tab === "income");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {tabMetrics.map((metric) => (
        <KpiCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
