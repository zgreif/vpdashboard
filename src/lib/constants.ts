import type { MonthlyRow } from "@/types";

export const APP_NAME = "viaPhoton";

export const CHART_COLORS = {
  // Income Statement
  salesOrders:    "#378ADD",
  revenue:        "#1D9E75",
  grossProfit:    "#7F77DD",
  ebitda:         "#BA7517",
  grossMargin:    "#7F77DD",
  ebitdaMargin:   "#BA7517",
  opex:           "#EF4444",
  payrollPercent: "#A855F7",
  // Cash Flow
  freeCashFlow:          "#0D9488",
  operatingFreeCashFlow: "#F97316",
  // Working Capital
  accountsReceivable: "#0EA5E9",
  accountsPayable:    "#F43F5E",
  inventory:          "#F59E0B",
  netWorkingCapital:  "#8B5CF6",
} as const;

/** Customer colors — indexed by position in the sorted customer list */
export const CUSTOMER_COLORS = ["#378ADD", "#1D9E75", "#7F77DD", "#BA7517"] as const;

export type MetricCalcType = "sum" | "margin" | "balance";

export interface MetricConfig {
  id: string;
  title: string;
  /** Which dashboard tab this metric belongs to */
  tab: "income" | "cashflow" | "nwc";
  color: string;
  unit: "currency" | "percent";
  chartType: "bar" | "line";
  /**
   * sum     — flows (revenue, FCF, …): monthly value / rolling LTM sum / quarterly sum
   * margin  — ratios (gross margin %): rolling numerator/denominator
   * balance — BS stocks (AR, AP, …): period-end balance / last-12 trend / end-of-quarter balance
   */
  calcType: MetricCalcType;
  /** Direct field on MonthlyRow */
  key?: keyof MonthlyRow;
  /**
   * Derived value computed from a MonthlyRow.
   * Takes precedence over `key` when present.
   * Use for metrics that combine multiple fields (e.g. NWC = AR + Inv − AP).
   */
  computeFn?: (row: MonthlyRow) => number;
  /** For calcType "margin" only */
  numeratorKey?: keyof MonthlyRow;
  denominatorKey?: keyof MonthlyRow;
}

/**
 * Single source of truth for every KPI metric.
 * To add a new metric: append one entry here — no other files need to change.
 * Tab components filter by `metric.tab`.
 */
export const METRIC_CONFIG: MetricConfig[] = [
  // ── Income Statement ──────────────────────────────────────────────────
  {
    id: "salesOrders",
    title: "Sales Orders",
    tab: "income",
    color: CHART_COLORS.salesOrders,
    unit: "currency",
    chartType: "bar",
    calcType: "sum",
    key: "salesOrders",
  },
  {
    id: "revenue",
    title: "Revenue",
    tab: "income",
    color: CHART_COLORS.revenue,
    unit: "currency",
    chartType: "bar",
    calcType: "sum",
    key: "revenue",
  },
  {
    id: "grossProfit",
    title: "Gross Profit",
    tab: "income",
    color: CHART_COLORS.grossProfit,
    unit: "currency",
    chartType: "bar",
    calcType: "sum",
    key: "grossProfit",
  },
  {
    id: "ebitda",
    title: "EBITDA",
    tab: "income",
    color: CHART_COLORS.ebitda,
    unit: "currency",
    chartType: "bar",
    calcType: "sum",
    key: "ebitda",
  },
  {
    id: "grossMargin",
    title: "Gross Margin",
    tab: "income",
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
    tab: "income",
    color: CHART_COLORS.ebitdaMargin,
    unit: "percent",
    chartType: "line",
    calcType: "margin",
    numeratorKey: "ebitda",
    denominatorKey: "revenue",
  },

  {
    id: "opex",
    title: "OpEx (excl. Commissions)",
    tab: "income",
    color: CHART_COLORS.opex,
    unit: "currency",
    chartType: "bar",
    calcType: "sum",
    key: "opex",
  },
  {
    id: "payrollPercent",
    title: "Payroll % of Revenue",
    tab: "income",
    color: CHART_COLORS.payrollPercent,
    unit: "percent",
    chartType: "line",
    calcType: "margin",
    numeratorKey: "payroll",
    denominatorKey: "revenue",
  },

  // ── Cash Flow ─────────────────────────────────────────────────────────
  {
    id: "freeCashFlow",
    title: "Free Cash Flow",
    tab: "cashflow",
    color: CHART_COLORS.freeCashFlow,
    unit: "currency",
    chartType: "bar",
    calcType: "sum",
    key: "freeCashFlow",
  },
  {
    id: "operatingFreeCashFlow",
    title: "Operating Free Cash Flow",
    tab: "cashflow",
    color: CHART_COLORS.operatingFreeCashFlow,
    unit: "currency",
    chartType: "bar",
    calcType: "sum",
    key: "operatingFreeCashFlow",
  },

  // ── Working Capital ───────────────────────────────────────────────────
  {
    id: "accountsReceivable",
    title: "Accounts Receivable",
    tab: "nwc",
    color: CHART_COLORS.accountsReceivable,
    unit: "currency",
    chartType: "line",
    calcType: "balance",
    key: "accountsReceivable",
  },
  {
    id: "accountsPayable",
    title: "Accounts Payable",
    tab: "nwc",
    color: CHART_COLORS.accountsPayable,
    unit: "currency",
    chartType: "line",
    calcType: "balance",
    key: "accountsPayable",
  },
  {
    id: "inventory",
    title: "Inventory",
    tab: "nwc",
    color: CHART_COLORS.inventory,
    unit: "currency",
    chartType: "line",
    calcType: "balance",
    key: "inventory",
  },
  {
    id: "netWorkingCapital",
    title: "Net Working Capital",
    tab: "nwc",
    color: CHART_COLORS.netWorkingCapital,
    unit: "currency",
    chartType: "line",
    calcType: "balance",
    // AR + Inventory − AP
    computeFn: (row) =>
      Math.round(
        ((row.accountsReceivable ?? 0) + (row.inventory ?? 0) - (row.accountsPayable ?? 0)) * 100
      ) / 100,
  },
];
