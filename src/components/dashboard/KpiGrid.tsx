import * as React from "react";
import { KpiCard } from "@/components/charts/KpiCard";
import type { KpiMetric } from "@/types";

interface KpiGridProps {
  metrics: KpiMetric[];
}

export function KpiGrid({ metrics }: KpiGridProps) {
  if (metrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No data available. Upload an Excel file or edit data to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <KpiCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
