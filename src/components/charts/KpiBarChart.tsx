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
  CHART_HEIGHT,
  BAR_CHART_MARGIN,
  LABEL_STYLE,
  AXIS_TICK_STYLE,
  BAR_CATEGORY_GAP,
  BAR_RADIUS,
  formatMonthLabel,
} from "@/lib/chartConfig";

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
  const formatted = data.map((d) => ({ ...d, monthLabel: formatMonthLabel(d.month) }));

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={formatted} margin={BAR_CHART_MARGIN} barCategoryGap={BAR_CATEGORY_GAP}>
        <XAxis
          dataKey="monthLabel"
          tick={AXIS_TICK_STYLE}
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
            style={LABEL_STYLE}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
