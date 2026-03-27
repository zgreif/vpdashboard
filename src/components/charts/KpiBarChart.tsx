"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface KpiBarChartProps {
  data: { month: string; value: number }[];
  color: string;
  unit: "currency" | "percent";
}

function formatValue(value: number, unit: "currency" | "percent"): string {
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
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{formatValue(payload[0].value ?? 0, unit)}</p>
    </div>
  );
}

export function KpiBarChart({ data, color, unit }: KpiBarChartProps) {
  const abbreviated = data.map((d) => ({
    ...d,
    monthShort: d.month.split(" ")[0],
  }));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={abbreviated} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="monthShort"
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => (unit === "percent" ? `${v}%` : `$${v}`)}
          width={38}
        />
        <Tooltip
          content={<CustomTooltip unit={unit} />}
          cursor={{ fill: "rgba(128,128,128,0.1)" }}
        />
        <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
