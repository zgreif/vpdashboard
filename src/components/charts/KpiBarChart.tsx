"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";
import {
  CHART_ASPECT,
  CHART_MIN_HEIGHT,
  CHART_MAX_HEIGHT,
  BAR_CHART_MARGIN,
  BAR_CATEGORY_GAP,
  BAR_RADIUS,
  formatMonthLabel,
} from "@/lib/chartConfig";
import { useChartMeasure } from "@/hooks/useChartMeasure";

function formatBarLabel(value: number, unit: "currency" | "percent"): string {
  if (unit === "percent") return `${value.toFixed(1)}%`;
  return `$${value.toFixed(1)}`;
}

function formatTooltip(value: number, unit: "currency" | "percent"): string {
  if (unit === "percent") return `${value.toFixed(1)}%`;
  return `$${value.toFixed(1)}M`;
}

interface TooltipEntry { value?: number }

function CustomTooltip({
  active, payload, label, unit,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  unit: "currency" | "percent";
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground">{formatTooltip(payload[0].value ?? 0, unit)}</p>
    </div>
  );
}

interface KpiBarChartProps {
  data: { month: string; value: number }[];
  color: string;
  unit: "currency" | "percent";
}

export function KpiBarChart({ data, color, unit }: KpiBarChartProps) {
  const { containerRef, labelFontSize, tickFontSize } = useChartMeasure();
  const formatted = data.map((d) => ({ ...d, monthLabel: formatMonthLabel(d.month) }));

  return (
    <div
      ref={containerRef}
      style={{
        aspectRatio: String(CHART_ASPECT),
        maxHeight: `${CHART_MAX_HEIGHT}px`,
        minHeight: `${CHART_MIN_HEIGHT}px`,
        width: "100%",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formatted} margin={BAR_CHART_MARGIN} barCategoryGap={BAR_CATEGORY_GAP}>
          <XAxis
            dataKey="monthLabel"
            tick={{ fontSize: tickFontSize, fill: "var(--foreground)" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ fill: "rgba(128,128,128,0.08)" }} />
          <Bar dataKey="value" fill={color} radius={BAR_RADIUS}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v: unknown) => formatBarLabel(Number(v ?? 0), unit)}
              style={{ fontSize: labelFontSize, fill: "var(--foreground)", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
