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
import {
  CHART_HEIGHT,
  CHART_MARGIN,
  LABEL_STYLE,
  AXIS_TICK_STYLE,
  formatMonthLabel,
} from "@/lib/chartConfig";

function formatPointLabel(value: number, unit: "currency" | "percent"): string {
  if (unit === "percent") return `${Math.round(value)}%`;
  return `$${Math.round(value)}`;
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

interface KpiLineChartProps {
  data: { month: string; value: number }[];
  color: string;
  unit: "currency" | "percent";
}

export function KpiLineChart({ data, color, unit }: KpiLineChartProps) {
  const formatted = data.map((d) => ({ ...d, monthLabel: formatMonthLabel(d.month) }));

  const values = formatted.map((d) => d.value);
  const dataMin = values.length > 0 ? Math.min(...values) : 0;
  const dataMax = values.length > 0 ? Math.max(...values) : 1;
  const range = dataMax - dataMin;
  const pad = Math.max(range * 0.3, dataMax * 0.04);
  const yDomain: [number, number] = [Math.max(0, dataMin - pad), dataMax + pad];

  const avg = values.length > 0 ? values.reduce((s, v) => s + v, 0) / values.length : 0;

  return (
    <div style={{ overflow: "visible" }}>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart data={formatted} margin={CHART_MARGIN}>
          <XAxis
            dataKey="monthLabel"
            tick={AXIS_TICK_STYLE}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={yDomain} />
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
              style={LABEL_STYLE}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
