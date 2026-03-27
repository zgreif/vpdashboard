import type { MonthlyRow } from "@/types";

const STORAGE_KEY = "fiber-kpi-data";

export const SAMPLE_DATA: MonthlyRow[] = [
  { month: "Jan 2024", salesOrders: 4.2,  revenue: 3.8, grossProfit: 1.33, ebitda: 0.57 },
  { month: "Feb 2024", salesOrders: 4.5,  revenue: 4.1, grossProfit: 1.48, ebitda: 0.66 },
  { month: "Mar 2024", salesOrders: 5.1,  revenue: 4.6, grossProfit: 1.70, ebitda: 0.87 },
  { month: "Apr 2024", salesOrders: 4.8,  revenue: 5.0, grossProfit: 1.80, ebitda: 0.90 },
  { month: "May 2024", salesOrders: 5.3,  revenue: 5.2, grossProfit: 1.87, ebitda: 0.94 },
  { month: "Jun 2024", salesOrders: 5.8,  revenue: 5.5, grossProfit: 2.03, ebitda: 1.05 },
  { month: "Jul 2024", salesOrders: 5.2,  revenue: 5.8, grossProfit: 2.09, ebitda: 1.04 },
  { month: "Aug 2024", salesOrders: 6.1,  revenue: 6.0, grossProfit: 2.22, ebitda: 1.14 },
  { month: "Sep 2024", salesOrders: 6.4,  revenue: 6.3, grossProfit: 2.33, ebitda: 1.20 },
  { month: "Oct 2024", salesOrders: 6.0,  revenue: 6.1, grossProfit: 2.26, ebitda: 1.16 },
  { month: "Nov 2024", salesOrders: 6.7,  revenue: 6.5, grossProfit: 2.41, ebitda: 1.24 },
  { month: "Dec 2024", salesOrders: 7.1,  revenue: 6.8, grossProfit: 2.52, ebitda: 1.29 },
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
    // Ignore storage errors (e.g. private browsing quotas)
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
