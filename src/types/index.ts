export type DashTab = "income" | "cashflow" | "nwc" | "customers";

export interface MonthlyRow {
  month: string;       // "Jan 2024"
  salesOrders: number; // $M
  revenue: number;     // $M
  grossProfit: number; // $M
  ebitda: number;      // $M

  // ── Extended / optional fields ────────────────────────────────────────
  // Cash Flow
  freeCashFlow?: number;           // $M
  operatingFreeCashFlow?: number;  // $M

  // Working Capital (balance sheet balances at period end)
  accountsReceivable?: number;     // $M
  accountsPayable?: number;        // $M
  inventory?: number;              // $M

  // Operating costs
  opex?: number;     // $M — fixed operating expenses excl. commissions
  payroll?: number;  // $M — payroll costs (subset of opex, used for payroll % of revenue)
}

export interface KpiMetric {
  id: string;
  title: string;
  tab: "income" | "cashflow" | "nwc";
  value: number;
  unit: "currency" | "percent";
  chartType: "bar" | "line";
  yoyChange: number;
  chartData: { month: string; value: number }[];
  color: string;
}

/** One data point per customer per month for the Customers tab. */
export interface CustomerRow {
  month: string;     // "Jan 2024"
  customer: string;  // e.g. "Acme Telecom"
  revenue: number;   // $M
  orders: number;    // $M
}
