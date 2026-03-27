import type { MonthlyRow, KpiMetric } from "@/types";
import { METRIC_CONFIG, type MetricConfig } from "./constants";

export type ViewMode = "ltm" | "monthly" | "quarterly";

type SeriesPoint = { month: string; value: number };
type ValueFn = (row: MonthlyRow) => number;

// ─── Quarter helpers ──────────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getQuarterLabel(month: string): string {
  const [mon, year] = month.split(" ");
  const idx = MONTH_NAMES.indexOf(mon ?? "");
  const q = Math.floor(Math.max(idx, 0) / 3) + 1;
  return `Q${q}'${(year ?? "").slice(2)}`;
}

// ─── Value accessor ───────────────────────────────────────────────────────────

function makeValueFn(config: MetricConfig): ValueFn {
  if (config.computeFn) return config.computeFn;
  if (config.key) {
    const k = config.key;
    return (row) => Number(row[k] ?? 0);
  }
  return () => 0;
}

// ─── Series builders — sum / balance ─────────────────────────────────────────

function monthlySeries(data: MonthlyRow[], fn: ValueFn): SeriesPoint[] {
  return data.map((row) => ({
    month: row.month,
    value: Math.round(fn(row) * 100) / 100,
  }));
}

function ltmSumSeries(data: MonthlyRow[], fn: ValueFn): SeriesPoint[] {
  return data.map((_, idx) => {
    const slice = data.slice(Math.max(0, idx - 11), idx + 1);
    const value = slice.reduce((s, r) => s + fn(r), 0);
    return { month: data[idx].month, value: Math.round(value * 100) / 100 };
  });
}

function quarterlySumSeries(data: MonthlyRow[], fn: ValueFn): SeriesPoint[] {
  const map = new Map<string, number>();
  const order: string[] = [];
  data.forEach((row) => {
    const label = getQuarterLabel(row.month);
    if (!map.has(label)) { map.set(label, 0); order.push(label); }
    map.set(label, (map.get(label) ?? 0) + fn(row));
  });
  return order.map((label) => ({
    month: label,
    value: Math.round((map.get(label) ?? 0) * 100) / 100,
  }));
}

/** End-of-quarter balance — last MonthlyRow value within each quarter. */
function quarterlyBalanceSeries(data: MonthlyRow[], fn: ValueFn): SeriesPoint[] {
  const map = new Map<string, number>();
  const order: string[] = [];
  data.forEach((row) => {
    const label = getQuarterLabel(row.month);
    if (!map.has(label)) order.push(label);
    map.set(label, fn(row)); // overwrite — last month of the quarter wins
  });
  return order.map((label) => ({
    month: label,
    value: Math.round((map.get(label) ?? 0) * 100) / 100,
  }));
}

// ─── Series builders — margin ─────────────────────────────────────────────────

function ltmMarginSeries(
  data: MonthlyRow[],
  numKey: keyof MonthlyRow,
  denKey: keyof MonthlyRow
): SeriesPoint[] {
  return data.map((_, idx) => {
    const slice = data.slice(Math.max(0, idx - 11), idx + 1);
    const num = slice.reduce((s, r) => s + Number(r[numKey] ?? 0), 0);
    const den = slice.reduce((s, r) => s + Number(r[denKey] ?? 0), 0);
    return {
      month: data[idx].month,
      value: den !== 0 ? Math.round((num / den) * 1000) / 10 : 0,
    };
  });
}

function monthlyMarginSeries(
  data: MonthlyRow[],
  numKey: keyof MonthlyRow,
  denKey: keyof MonthlyRow
): SeriesPoint[] {
  return data.map((row) => {
    const num = Number(row[numKey] ?? 0);
    const den = Number(row[denKey] ?? 0);
    return {
      month: row.month,
      value: den !== 0 ? Math.round((num / den) * 1000) / 10 : 0,
    };
  });
}

function quarterlyMarginSeries(
  data: MonthlyRow[],
  numKey: keyof MonthlyRow,
  denKey: keyof MonthlyRow
): SeriesPoint[] {
  const numMap = new Map<string, number>();
  const denMap = new Map<string, number>();
  const order: string[] = [];
  data.forEach((row) => {
    const label = getQuarterLabel(row.month);
    if (!numMap.has(label)) { numMap.set(label, 0); denMap.set(label, 0); order.push(label); }
    numMap.set(label, (numMap.get(label) ?? 0) + Number(row[numKey] ?? 0));
    denMap.set(label, (denMap.get(label) ?? 0) + Number(row[denKey] ?? 0));
  });
  return order.map((label) => {
    const num = numMap.get(label) ?? 0;
    const den = denMap.get(label) ?? 0;
    return { month: label, value: den !== 0 ? Math.round((num / den) * 1000) / 10 : 0 };
  });
}

// ─── YoY helpers ─────────────────────────────────────────────────────────────

/** YoY % change: latest month vs same month 12 periods prior. */
export function calcYoY(data: MonthlyRow[], key: keyof MonthlyRow): number {
  if (data.length < 13) return 0;
  const latest = Number(data[data.length - 1][key] ?? 0);
  const prior = Number(data[data.length - 13][key] ?? 0);
  if (prior === 0) return 0;
  return Math.round(((latest - prior) / prior) * 1000) / 10;
}

function marginYoY(
  data: MonthlyRow[],
  numKey: keyof MonthlyRow,
  denKey: keyof MonthlyRow,
  mode: ViewMode
): number {
  // Build the same series that the chart uses, then look back within it.
  const series =
    mode === "ltm"
      ? ltmMarginSeries(data, numKey, denKey)
      : mode === "quarterly"
      ? quarterlyMarginSeries(data, numKey, denKey)
      : monthlyMarginSeries(data, numKey, denKey);

  // Quarterly: same quarter prior year = 4 periods back.
  // Monthly / LTM: same month prior year = 12 periods back.
  const lookback = mode === "quarterly" ? 4 : 12;
  if (series.length <= lookback) return 0;

  const current = series[series.length - 1]?.value ?? 0;
  const prior   = series[series.length - 1 - lookback]?.value ?? 0;
  if (prior === 0) return 0;
  return Math.round(((current - prior) / prior) * 1000) / 10;
}

// ─── Public legacy exports (kept for any future direct callers) ───────────────

/** Rolling 12-month sum series. */
export function calcLtmSeries(
  data: MonthlyRow[],
  key: keyof MonthlyRow
): SeriesPoint[] {
  return ltmSumSeries(data, (row) => Number(row[key] ?? 0));
}

/** Rolling 12-month margin % series. */
export function calcMarginSeries(
  data: MonthlyRow[],
  numeratorKey: keyof MonthlyRow,
  denominatorKey: keyof MonthlyRow
): SeriesPoint[] {
  return ltmMarginSeries(data, numeratorKey, denominatorKey);
}

// ─── Main builder ─────────────────────────────────────────────────────────────

/**
 * Build KpiMetric objects for every entry in METRIC_CONFIG.
 * Tab components filter the result by `metric.tab`.
 */
export function buildAllKpis(data: MonthlyRow[], mode: ViewMode = "ltm"): KpiMetric[] {
  if (data.length === 0) return [];

  return METRIC_CONFIG.map((config) => {
    let chartData: SeriesPoint[];
    let value: number;
    let yoyChange: number;

    if (config.calcType === "sum") {
      const fn = makeValueFn(config);
      if (mode === "ltm") {
        chartData = ltmSumSeries(data, fn);
      } else if (mode === "monthly") {
        chartData = monthlySeries(data, fn);
      } else {
        chartData = quarterlySumSeries(data, fn);
      }
      value = chartData[chartData.length - 1]?.value ?? 0;
      yoyChange = config.key ? calcYoY(data, config.key) : 0;

    } else if (config.calcType === "margin" && config.numeratorKey && config.denominatorKey) {
      const { numeratorKey: nk, denominatorKey: dk } = config;
      if (mode === "ltm") {
        chartData = ltmMarginSeries(data, nk, dk);
      } else if (mode === "monthly") {
        chartData = monthlyMarginSeries(data, nk, dk);
      } else {
        chartData = quarterlyMarginSeries(data, nk, dk);
      }
      value = chartData[chartData.length - 1]?.value ?? 0;
      yoyChange = marginYoY(data, nk, dk, mode);

    } else if (config.calcType === "balance") {
      const fn = makeValueFn(config);
      // Monthly and LTM both show the balance trend over available months
      if (mode === "quarterly") {
        chartData = quarterlyBalanceSeries(data, fn);
      } else {
        chartData = monthlySeries(data, fn);
      }
      value = chartData[chartData.length - 1]?.value ?? 0;
      // YoY on balance sheet items requires 24+ months; show 0 for now
      yoyChange = 0;

    } else {
      chartData = [];
      value = 0;
      yoyChange = 0;
    }

    return {
      id: config.id,
      title: config.title,
      tab: config.tab,
      value,
      unit: config.unit,
      chartType: config.chartType,
      yoyChange,
      chartData,
      color: config.color,
    };
  });
}
