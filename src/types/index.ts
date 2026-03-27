export interface MonthlyRow {
  month: string;       // "Jan 2024"
  salesOrders: number; // $M
  revenue: number;     // $M
  grossProfit: number; // $M
  ebitda: number;      // $M
}

export interface KpiMetric {
  id: string;
  title: string;
  value: number;
  unit: "currency" | "percent";
  chartType: "bar" | "line";
  yoyChange: number;
  chartData: { month: string; value: number }[];
  color: string;
}
