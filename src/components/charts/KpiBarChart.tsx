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

/** "Jan 2024" → "Jan'24" */
function formatMonthLabel(month: string): string {
  const parts = month.split(" ");
  return `${parts[0]}'${(parts[1] ?? "").slice(2)}`;
}

/** Label above each bar — 1 decimal, no M suffix */
function formatBarLabel(value: number, unit: "currency" | "percent"): string {
  if (unit === "percent") return `${value.toFixed(1)}%`;
  return `$${value.toFixed(1)}`;
}

/** Full value shown in tooltip */
function formatTooltip(value: number, unit: "currency" | "percent"): string {
  if (unit === "percent") return `${value.toFixed(1)}%`;
  return `$${value.toFixed(1)}M`;
}

interface TooltipEntry {
  value?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
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
  const formatted = data.map((d) => ({
    ...d,
    monthLabel: formatMonthLabel(d.month),
  }));

  return (
    <ResponsiveContainer width="100%" height={190}>
      <BarChart
        data={formatted}
        margin={{ top: 30, right: 8, left: 0, bottom: 0 }}
        barCategoryGap="6%"
      >
        <XAxis
          dataKey="monthLabel"
          tick={{ fontSize: 9, fill: "var(--foreground)" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis hide />
        <Tooltip
          content={<CustomTooltip unit={unit} />}
          cursor={{ fill: "rgba(128,128,128,0.08)" }}
        />
        <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]}>
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v: unknown) => formatBarLabel(Number(v ?? 0), unit)}
            style={{ fontSize: 12, fill: "var(--foreground)", fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
