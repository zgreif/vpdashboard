"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useChartDownload } from "@/hooks/useChartDownload";
import { CUSTOMER_COLORS } from "@/lib/constants";
import {
  CHART_ASPECT,
  CHART_MIN_HEIGHT,
  BAR_CHART_MARGIN,
  AXIS_TICK_STYLE,
  BAR_CATEGORY_GAP,
  formatMonthLabel,
} from "@/lib/chartConfig";
import type { CustomerRow } from "@/types";
import type { ViewMode } from "@/lib/calculations";

// ─── Data transformation ──────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getQuarterLabel(month: string): string {
  const [mon, year] = month.split(" ");
  const idx = MONTH_NAMES.indexOf(mon ?? "");
  const q = Math.floor(Math.max(idx, 0) / 3) + 1;
  return `Q${q}'${(year ?? "").slice(2)}`;
}

type PivotRow = Record<string, string | number>;

function buildPivotData(
  data: CustomerRow[],
  metric: "revenue" | "orders",
  mode: ViewMode,
  customers: string[]
): PivotRow[] {
  const months = Array.from(new Set(data.map((r) => r.month)));

  if (mode === "quarterly") {
    const qMap = new Map<string, Record<string, number>>();
    const qOrder: string[] = [];
    data.forEach((row) => {
      const label = getQuarterLabel(row.month);
      if (!qMap.has(label)) { qMap.set(label, {}); qOrder.push(label); }
      const entry = qMap.get(label)!;
      entry[row.customer] = Math.round(((entry[row.customer] ?? 0) + row[metric]) * 100) / 100;
    });
    return qOrder.map((label) => ({
      monthLabel: label,
      ...(qMap.get(label) ?? {}),
    }));
  }

  return months.map((month, idx) => {
    const row: PivotRow = { monthLabel: formatMonthLabel(month) };
    customers.forEach((customer) => {
      if (mode === "ltm") {
        const startIdx = Math.max(0, idx - 11);
        const sliceMonths = months.slice(startIdx, idx + 1);
        const sum = data
          .filter((r) => r.customer === customer && sliceMonths.includes(r.month))
          .reduce((s, r) => s + r[metric], 0);
        row[customer] = Math.round(sum * 100) / 100;
      } else {
        const match = data.find((r) => r.month === month && r.customer === customer);
        row[customer] = match ? match[metric] : 0;
      }
    });
    return row;
  });
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipPayloadEntry {
  dataKey: string;
  value: number;
  fill: string;
}

function CustomerTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  // Reverse so the top-most customer appears first in the tooltip
  const sorted = [...payload].reverse();
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-md min-w-[160px]">
      <p className="font-medium text-foreground mb-1.5">{label}</p>
      {sorted.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: p.fill }} />
            <span className="text-muted-foreground">{p.dataKey}</span>
          </div>
          <span className="font-medium text-foreground">${Number(p.value).toFixed(1)}M</span>
        </div>
      ))}
      <div className="mt-1.5 pt-1.5 border-t flex items-center justify-between gap-4">
        <span className="text-muted-foreground">Total</span>
        <span className="font-semibold text-foreground">${total.toFixed(1)}M</span>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CustomerBarChartProps {
  data: CustomerRow[];
  metric: "revenue" | "orders";
  mode: ViewMode;
  title: string;
}

export function CustomerBarChart({ data, metric, mode, title }: CustomerBarChartProps) {
  const { ref, download } = useChartDownload(title);

  const customers = Array.from(new Set(data.map((r) => r.customer))).sort();
  const pivotData = buildPivotData(data, metric, mode, customers);

  return (
    <Card ref={ref} className="overflow-hidden relative group">
      <CardHeader className="pb-1 pt-4 px-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-base font-semibold text-foreground">{title}</p>
          <button
            onClick={download}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
            title={`Download ${title} chart`}
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
          {customers.map((c, i) => (
            <div key={c} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{ background: CUSTOMER_COLORS[i % CUSTOMER_COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground">{c}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-2 pt-1">
        <ResponsiveContainer width="100%" aspect={CHART_ASPECT} minHeight={CHART_MIN_HEIGHT}>
          <BarChart data={pivotData} margin={BAR_CHART_MARGIN} barCategoryGap={BAR_CATEGORY_GAP}>
            <XAxis
              dataKey="monthLabel"
              tick={AXIS_TICK_STYLE}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis hide />
            <Tooltip
              content={<CustomerTooltip />}
              cursor={{ fill: "rgba(128,128,128,0.08)" }}
            />
            {customers.map((customer, i) => (
              <Bar
                key={customer}
                dataKey={customer}
                stackId="customers"
                fill={CUSTOMER_COLORS[i % CUSTOMER_COLORS.length]}
                radius={i === customers.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
