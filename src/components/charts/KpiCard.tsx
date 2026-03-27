"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiBarChart } from "./KpiBarChart";
import { KpiLineChart } from "./KpiLineChart";
import type { KpiMetric } from "@/types";

interface KpiCardProps {
  metric: KpiMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const hasYoY = metric.yoyChange !== 0;
  const isPositive = metric.yoyChange >= 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-1 pt-4 px-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-base font-semibold text-foreground">
            {metric.title}
          </p>
          {hasYoY && (
            <Badge variant={isPositive ? "success" : "danger"} className="shrink-0 text-xs">
              {isPositive ? "+" : ""}
              {metric.yoyChange.toFixed(1)}% YoY
            </Badge>
          )}
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
