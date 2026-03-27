import type { MonthlyRow, CustomerRow } from "@/types";

const STORAGE_KEY = "fiber-kpi-data";

export const SAMPLE_DATA: MonthlyRow[] = [
  // Core P&L + Cash Flow + Working Capital (balance sheet end-of-month balances)
  // FCF ≈ EBITDA × 0.50  |  OpFCF ≈ EBITDA × 0.65
  // AR ≈ 1.5× monthly revenue  |  AP ≈ 0.65× monthly COGS  |  Inventory ≈ 0.20× revenue
  { month: "Jan 2024", salesOrders: 4.2, revenue: 3.8, grossProfit: 1.33, ebitda: 0.57, freeCashFlow: 0.28, operatingFreeCashFlow: 0.37, accountsReceivable: 5.70, accountsPayable: 1.60, inventory: 0.76 },
  { month: "Feb 2024", salesOrders: 4.5, revenue: 4.1, grossProfit: 1.48, ebitda: 0.66, freeCashFlow: 0.33, operatingFreeCashFlow: 0.43, accountsReceivable: 6.15, accountsPayable: 1.70, inventory: 0.82 },
  { month: "Mar 2024", salesOrders: 5.1, revenue: 4.6, grossProfit: 1.70, ebitda: 0.87, freeCashFlow: 0.44, operatingFreeCashFlow: 0.57, accountsReceivable: 6.90, accountsPayable: 1.90, inventory: 0.92 },
  { month: "Apr 2024", salesOrders: 4.8, revenue: 5.0, grossProfit: 1.80, ebitda: 0.90, freeCashFlow: 0.45, operatingFreeCashFlow: 0.59, accountsReceivable: 7.50, accountsPayable: 2.10, inventory: 1.00 },
  { month: "May 2024", salesOrders: 5.3, revenue: 5.2, grossProfit: 1.87, ebitda: 0.94, freeCashFlow: 0.47, operatingFreeCashFlow: 0.61, accountsReceivable: 7.80, accountsPayable: 2.16, inventory: 1.04 },
  { month: "Jun 2024", salesOrders: 5.8, revenue: 5.5, grossProfit: 2.03, ebitda: 1.05, freeCashFlow: 0.53, operatingFreeCashFlow: 0.68, accountsReceivable: 8.25, accountsPayable: 2.28, inventory: 1.10 },
  { month: "Jul 2024", salesOrders: 5.2, revenue: 5.8, grossProfit: 2.09, ebitda: 1.04, freeCashFlow: 0.52, operatingFreeCashFlow: 0.68, accountsReceivable: 8.70, accountsPayable: 2.40, inventory: 1.16 },
  { month: "Aug 2024", salesOrders: 6.1, revenue: 6.0, grossProfit: 2.22, ebitda: 1.14, freeCashFlow: 0.57, operatingFreeCashFlow: 0.74, accountsReceivable: 9.00, accountsPayable: 2.48, inventory: 1.20 },
  { month: "Sep 2024", salesOrders: 6.4, revenue: 6.3, grossProfit: 2.33, ebitda: 1.20, freeCashFlow: 0.60, operatingFreeCashFlow: 0.78, accountsReceivable: 9.45, accountsPayable: 2.60, inventory: 1.26 },
  { month: "Oct 2024", salesOrders: 6.0, revenue: 6.1, grossProfit: 2.26, ebitda: 1.16, freeCashFlow: 0.58, operatingFreeCashFlow: 0.75, accountsReceivable: 9.15, accountsPayable: 2.52, inventory: 1.22 },
  { month: "Nov 2024", salesOrders: 6.7, revenue: 6.5, grossProfit: 2.41, ebitda: 1.24, freeCashFlow: 0.62, operatingFreeCashFlow: 0.81, accountsReceivable: 9.75, accountsPayable: 2.68, inventory: 1.30 },
  { month: "Dec 2024", salesOrders: 7.1, revenue: 6.8, grossProfit: 2.52, ebitda: 1.29, freeCashFlow: 0.65, operatingFreeCashFlow: 0.84, accountsReceivable: 10.20, accountsPayable: 2.80, inventory: 1.36 },
];

// ── Customer sample data ──────────────────────────────────────────────────────
// 4 customers. Revenue sums to match SAMPLE_DATA revenue each month.
// Distribution: Acme 35%, BlueStar 28%, Summit 22%, Other 15%
// Orders distribution: Acme 30%, BlueStar 25%, Summit 25%, Other 20%

export const SAMPLE_CUSTOMER_DATA: CustomerRow[] = [
  // Jan 2024  — Revenue 3.80, Orders 4.20
  { month: "Jan 2024", customer: "Acme Telecom",   revenue: 1.33, orders: 1.26 },
  { month: "Jan 2024", customer: "BlueStar ISP",   revenue: 1.06, orders: 1.05 },
  { month: "Jan 2024", customer: "Summit Networks",revenue: 0.84, orders: 1.05 },
  { month: "Jan 2024", customer: "Other",          revenue: 0.57, orders: 0.84 },
  // Feb 2024  — Revenue 4.10, Orders 4.50
  { month: "Feb 2024", customer: "Acme Telecom",   revenue: 1.44, orders: 1.35 },
  { month: "Feb 2024", customer: "BlueStar ISP",   revenue: 1.15, orders: 1.13 },
  { month: "Feb 2024", customer: "Summit Networks",revenue: 0.90, orders: 1.13 },
  { month: "Feb 2024", customer: "Other",          revenue: 0.61, orders: 0.89 },
  // Mar 2024  — Revenue 4.60, Orders 5.10
  { month: "Mar 2024", customer: "Acme Telecom",   revenue: 1.61, orders: 1.53 },
  { month: "Mar 2024", customer: "BlueStar ISP",   revenue: 1.29, orders: 1.28 },
  { month: "Mar 2024", customer: "Summit Networks",revenue: 1.01, orders: 1.28 },
  { month: "Mar 2024", customer: "Other",          revenue: 0.69, orders: 1.01 },
  // Apr 2024  — Revenue 5.00, Orders 4.80
  { month: "Apr 2024", customer: "Acme Telecom",   revenue: 1.75, orders: 1.44 },
  { month: "Apr 2024", customer: "BlueStar ISP",   revenue: 1.40, orders: 1.20 },
  { month: "Apr 2024", customer: "Summit Networks",revenue: 1.10, orders: 1.20 },
  { month: "Apr 2024", customer: "Other",          revenue: 0.75, orders: 0.96 },
  // May 2024  — Revenue 5.20, Orders 5.30
  { month: "May 2024", customer: "Acme Telecom",   revenue: 1.82, orders: 1.59 },
  { month: "May 2024", customer: "BlueStar ISP",   revenue: 1.46, orders: 1.33 },
  { month: "May 2024", customer: "Summit Networks",revenue: 1.14, orders: 1.33 },
  { month: "May 2024", customer: "Other",          revenue: 0.78, orders: 1.05 },
  // Jun 2024  — Revenue 5.50, Orders 5.80
  { month: "Jun 2024", customer: "Acme Telecom",   revenue: 1.93, orders: 1.74 },
  { month: "Jun 2024", customer: "BlueStar ISP",   revenue: 1.54, orders: 1.45 },
  { month: "Jun 2024", customer: "Summit Networks",revenue: 1.21, orders: 1.45 },
  { month: "Jun 2024", customer: "Other",          revenue: 0.82, orders: 1.16 },
  // Jul 2024  — Revenue 5.80, Orders 5.20
  { month: "Jul 2024", customer: "Acme Telecom",   revenue: 2.03, orders: 1.56 },
  { month: "Jul 2024", customer: "BlueStar ISP",   revenue: 1.62, orders: 1.30 },
  { month: "Jul 2024", customer: "Summit Networks",revenue: 1.28, orders: 1.30 },
  { month: "Jul 2024", customer: "Other",          revenue: 0.87, orders: 1.04 },
  // Aug 2024  — Revenue 6.00, Orders 6.10
  { month: "Aug 2024", customer: "Acme Telecom",   revenue: 2.10, orders: 1.83 },
  { month: "Aug 2024", customer: "BlueStar ISP",   revenue: 1.68, orders: 1.53 },
  { month: "Aug 2024", customer: "Summit Networks",revenue: 1.32, orders: 1.52 },
  { month: "Aug 2024", customer: "Other",          revenue: 0.90, orders: 1.22 },
  // Sep 2024  — Revenue 6.30, Orders 6.40
  { month: "Sep 2024", customer: "Acme Telecom",   revenue: 2.21, orders: 1.92 },
  { month: "Sep 2024", customer: "BlueStar ISP",   revenue: 1.76, orders: 1.60 },
  { month: "Sep 2024", customer: "Summit Networks",revenue: 1.39, orders: 1.60 },
  { month: "Sep 2024", customer: "Other",          revenue: 0.94, orders: 1.28 },
  // Oct 2024  — Revenue 6.10, Orders 6.00
  { month: "Oct 2024", customer: "Acme Telecom",   revenue: 2.14, orders: 1.80 },
  { month: "Oct 2024", customer: "BlueStar ISP",   revenue: 1.71, orders: 1.50 },
  { month: "Oct 2024", customer: "Summit Networks",revenue: 1.34, orders: 1.50 },
  { month: "Oct 2024", customer: "Other",          revenue: 0.91, orders: 1.20 },
  // Nov 2024  — Revenue 6.50, Orders 6.70
  { month: "Nov 2024", customer: "Acme Telecom",   revenue: 2.28, orders: 2.01 },
  { month: "Nov 2024", customer: "BlueStar ISP",   revenue: 1.82, orders: 1.68 },
  { month: "Nov 2024", customer: "Summit Networks",revenue: 1.43, orders: 1.68 },
  { month: "Nov 2024", customer: "Other",          revenue: 0.97, orders: 1.33 },
  // Dec 2024  — Revenue 6.80, Orders 7.10
  { month: "Dec 2024", customer: "Acme Telecom",   revenue: 2.38, orders: 2.13 },
  { month: "Dec 2024", customer: "BlueStar ISP",   revenue: 1.90, orders: 1.78 },
  { month: "Dec 2024", customer: "Summit Networks",revenue: 1.50, orders: 1.78 },
  { month: "Dec 2024", customer: "Other",          revenue: 1.02, orders: 1.41 },
];

export function loadFromStorage(): MonthlyRow[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MonthlyRow[]) : null;
  } catch {
    return null;
  }
}

export function saveToStorage(data: MonthlyRow[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
