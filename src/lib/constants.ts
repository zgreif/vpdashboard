import type { MonthlyRow } from "@/types";

export const APP_NAME = "Fiber KPI";

export const CHART_COLORS = {
  salesOrders: "#378ADD",
  revenue: "#1D9E75",
  grossProfit: "#7F77DD",
  ebitda: "#BA7517",
  grossMargin: "#7F77DD",
  ebitdaMargin: "#BA7517",
} as const;

export type MetricCalcType = "ltm" | "margin";

export interface MetricConfig {
  id: string;
  title: string;
  color: string;
  unit: "currency" | "percent";
  chartType: "bar" | "line";
  calcType: MetricCalcType;
  key?: keyof MonthlyRow;
  numeratorKey?: keyof MonthlyRow;
  denominatorKey?: keyof MonthlyRow;
}

/**
 * Single source of truth for all KPI metrics.
 * To add a new metric, append one entry here — no other changes needed.
 */
export const METRIC_CONFIG: MetricConfig[] = [
  {
    id: "salesOrders",
    title: "Sales Orders",
    color: CHART_COLORS.salesOrders,
    unit: "currency",
    chartType: "bar",
    calcType: "ltm",
    key: "salesOrders",
  },
  {
    id: "revenue",
    title: "Revenue",
    color: CHART_COLORS.revenue,
    unit: "currency",
    chartType: "bar",
    calcType: "ltm",
    key: "revenue",
  },
  {
    id: "grossProfit",
    title: "Gross Profit",
    color: CHART_COLORS.grossProfit,
    unit: "currency",
    chartType: "bar",
    calcType: "ltm",
    key: "grossProfit",
  },
  {
    id: "ebitda",
    title: "EBITDA",
    color: CHART_COLORS.ebitda,
    unit: "currency",
    chartType: "bar",
    calcType: "ltm",
    key: "ebitda",
  },
  {
    id: "grossMargin",
    title: "Gross Margin",
    color: CHART_COLORS.grossMargin,
    unit: "percent",
    chartType: "line",
    calcType: "margin",
    numeratorKey: "grossProfit",
    denominatorKey: "revenue",
  },
  {
    id: "ebitdaMargin",
    title: "EBITDA Margin",
    color: CHART_COLORS.ebitdaMargin,
    unit: "percent",
    chartType: "line",
    calcType: "margin",
    numeratorKey: "ebitda",
    denominatorKey: "revenue",
  },
];
