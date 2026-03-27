"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  LabelList,
} from "recharts";

/** "Jan 2024" → "Jan'24" */
function formatMonthLabel(month: string): string {
  const parts = month.split(" ");
  return `${parts[0]}'${(parts[1] ?? "").slice(2)}`;
}

/** Label above each data point — 1 decimal */
function formatPointLabel(value: number, unit: "currency" | "percent"): string {
  if (unit === "percent") return `${value.toFixed(1)}%`;
  return `$${value.toFixed(1)}`;
}

/** Y-axis tick — no decimals */
function formatAxisTick(v: number, unit: "currency" | "percent"): string {
  if (unit === "percent") return `${Math.round(v)}%`;
  return `$${Math.round(v)}`;
}

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

interface KpiLineChartProps {
  data: { month: string; value: number }[];
  color: string;
  unit: "currency" | "percent";
}

export function KpiLineChart({ data, color, unit }: KpiLineChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    monthLabel: formatMonthLabel(d.month),
  }));

  const avg =
    formatted.length > 0
      ? formatted.reduce((s, d) => s + d.value, 0) / formatted.length
      : 0;

  return (
    <ResponsiveContainer width="100%" height={190}>
      <LineChart
        data={formatted}
        margin={{ top: 30, right: 8, left: 4, bottom: 0 }}
      >
        <XAxis
          dataKey="monthLabel"
          tick={{ fontSize: 9, fill: "var(--foreground)" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 9, fill: "var(--foreground)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => formatAxisTick(v, unit)}
          width={44}
        />
        <Tooltip
          content={<CustomTooltip unit={unit} />}
          cursor={{ stroke: "rgba(128,128,128,0.2)", strokeWidth: 1 }}
        />
        <ReferenceLine
          y={avg}
          stroke="rgba(128,128,128,0.25)"
          strokeDasharray="4 3"
          strokeWidth={1}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          dot={{ fill: color, r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, strokeWidth: 0 }}
        >
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v: unknown) => formatPointLabel(Number(v ?? 0), unit)}
            style={{ fontSize: 12, fill: "var(--foreground)", fontWeight: 600 }}
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}
