import * as React from "react";
import { KpiCard } from "@/components/charts/KpiCard";
import type { KpiMetric } from "@/types";

interface WorkingCapitalTabProps {
  metrics: KpiMetric[];
}

export function WorkingCapitalTab({ metrics }: WorkingCapitalTabProps) {
  const tabMetrics = metrics.filter((m) => m.tab === "nwc");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {tabMetrics.map((metric) => (
        <KpiCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
