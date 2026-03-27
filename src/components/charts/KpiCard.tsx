"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiBarChart } from "./KpiBarChart";
import { KpiLineChart } from "./KpiLineChart";
import { useChartDownload } from "@/hooks/useChartDownload";
import type { KpiMetric } from "@/types";

interface KpiCardProps {
  metric: KpiMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const { ref, download } = useChartDownload(metric.title);
  const hasYoY = metric.yoyChange !== 0;
  const isPositive = metric.yoyChange >= 0;

  return (
    <Card ref={ref} className="overflow-hidden relative group">
      <CardHeader className="pb-1 pt-4 px-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-base font-semibold text-foreground">{metric.title}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            {hasYoY && (
              <Badge variant={isPositive ? "success" : "danger"} className="text-xs">
                {isPositive ? "+" : ""}
                {metric.yoyChange.toFixed(1)}% YoY
              </Badge>
            )}
            <button
              onClick={download}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
              title={`Download ${metric.title} chart`}
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-2 pt-1">
        {metric.chartType === "line" ? (
          <KpiLineChart data={metric.chartData} color={metric.color} unit={metric.unit} />
        ) : (
          <KpiBarChart data={metric.chartData} color={metric.color} unit={metric.unit} />
        )}
      </CardContent>
    </Card>
  );
}
