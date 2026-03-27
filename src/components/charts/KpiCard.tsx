"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiBarChart } from "./KpiBarChart";
import type { KpiMetric } from "@/types";

function formatHeadline(value: number, unit: "currency" | "percent"): string {
  if (unit === "percent") return `${value.toFixed(1)}%`;
  return `$${value.toFixed(1)}M`;
}

interface KpiCardProps {
  metric: KpiMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const hasYoY = metric.yoyChange !== 0;
  const isPositive = metric.yoyChange >= 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {metric.title}
          </p>
          {hasYoY && (
            <Badge variant={isPositive ? "success" : "danger"} className="shrink-0">
              {isPositive ? "+" : ""}
              {metric.yoyChange.toFixed(1)}% YoY
            </Badge>
          )}
        </div>
        <p className="text-2xl sm:text-3xl font-bold tabular-nums">
          {formatHeadline(metric.value, metric.unit)}
        </p>
      </CardHeader>
      <CardContent className="pb-4 px-2">
        <KpiBarChart data={metric.chartData} color={metric.color} unit={metric.unit} />
      </CardContent>
    </Card>
  );
}
