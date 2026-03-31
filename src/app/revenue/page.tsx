"use client";

import * as React from "react";
import { TopNav } from "@/components/layout/TopNav";
import { KpiCard } from "@/components/charts/KpiCard";
import { CustomerBarChart } from "@/components/charts/CustomerBarChart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useKpiData } from "@/hooks/useKpiData";
import { SAMPLE_CUSTOMER_DATA } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/calculations";

// ─── View mode toggle ─────────────────────────────────────────────────────────

function ViewModeToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const modes: { id: ViewMode; label: string }[] = [
    { id: "monthly",   label: "Monthly" },
    { id: "ltm",       label: "LTM" },
    { id: "quarterly", label: "Quarterly" },
  ];
  return (
    <div className="flex items-center rounded-md border bg-background overflow-hidden text-sm font-medium">
      {modes.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "px-3 py-1.5 transition-colors",
            value === id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Customer revenue table ───────────────────────────────────────────────────

function CustomerRevenueTable() {
  const customers = Array.from(
    new Set(SAMPLE_CUSTOMER_DATA.map((r) => r.customer))
  ).sort();
  const months = Array.from(
    new Set(SAMPLE_CUSTOMER_DATA.map((r) => r.month))
  );

  // Compute totals per month
  const monthTotals = months.map((month) =>
    SAMPLE_CUSTOMER_DATA
      .filter((r) => r.month === month)
      .reduce((s, r) => s + r.revenue, 0)
  );

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <p className="text-base font-semibold text-foreground">Monthly Revenue by Customer ($M)</p>
      </CardHeader>
      <CardContent className="px-0 pb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground whitespace-nowrap">
                Customer
              </th>
              {months.map((m) => (
                <th
                  key={m}
                  className="text-right px-3 py-2 font-medium text-muted-foreground whitespace-nowrap"
                >
                  {m.replace(" 20", " '")}
                </th>
              ))}
              <th className="text-right px-4 py-2 font-medium text-muted-foreground whitespace-nowrap">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, ci) => {
              const rowTotal = SAMPLE_CUSTOMER_DATA
                .filter((r) => r.customer === customer)
                .reduce((s, r) => s + r.revenue, 0);
              return (
                <tr
                  key={customer}
                  className={cn(
                    "border-b last:border-0",
                    ci % 2 === 0 ? "bg-transparent" : "bg-muted/30"
                  )}
                >
                  <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">
                    {customer}
                  </td>
                  {months.map((month) => {
                    const val = SAMPLE_CUSTOMER_DATA.find(
                      (r) => r.month === month && r.customer === customer
                    )?.revenue ?? 0;
                    return (
                      <td key={month} className="text-right px-3 py-2 text-foreground tabular-nums">
                        ${val.toFixed(1)}
                      </td>
                    );
                  })}
                  <td className="text-right px-4 py-2 font-semibold text-foreground tabular-nums">
                    ${rowTotal.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 bg-muted/20">
              <td className="px-4 py-2 font-semibold text-foreground">Total</td>
              {monthTotals.map((total, i) => (
                <td key={i} className="text-right px-3 py-2 font-semibold text-foreground tabular-nums">
                  ${total.toFixed(1)}
                </td>
              ))}
              <td className="text-right px-4 py-2 font-semibold text-foreground tabular-nums">
                ${monthTotals.reduce((s, v) => s + v, 0).toFixed(1)}
              </td>
            </tr>
          </tfoot>
        </table>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RevenuePage() {
  const { metrics, viewMode, setViewMode } = useKpiData();

  // Pull only the revenue and orders KPI cards from the existing metric system
  const revenueMetrics = metrics.filter((m) =>
    ["revenue", "salesOrders"].includes(m.id)
  );

  return (
    <div className="flex flex-col flex-1">
      <TopNav
        actions={<ViewModeToggle value={viewMode} onChange={setViewMode} />}
      />

      <main className="flex-1 p-6 flex flex-col gap-6">

        {/* ── Summary KPIs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {revenueMetrics.map((metric) => (
            <KpiCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* ── Customer breakdown charts ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomerBarChart
            data={SAMPLE_CUSTOMER_DATA}
            metric="revenue"
            mode={viewMode}
            title="Revenue by Customer"
          />
          <CustomerBarChart
            data={SAMPLE_CUSTOMER_DATA}
            metric="orders"
            mode={viewMode}
            title="Orders by Customer"
          />
        </div>

        {/* ── Monthly table ── */}
        <CustomerRevenueTable />

      </main>
    </div>
  );
}
