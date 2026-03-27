import type { MonthlyRow, KpiMetric } from "@/types";
import { METRIC_CONFIG } from "./constants";

/** Rolling 12-month sum for each data point. */
export function calcLtmSeries(
  data: MonthlyRow[],
  key: keyof MonthlyRow
): { month: string; value: number }[] {
  return data.map((_, idx) => {
    const start = Math.max(0, idx - 11);
    const slice = data.slice(start, idx + 1);
    const value = slice.reduce((sum, row) => sum + (row[key] as number), 0);
    return { month: data[idx].month, value: Math.round(value * 100) / 100 };
  });
}

/** Rolling 12-month margin % (numerator / denominator * 100) for each data point. */
export function calcMarginSeries(
  data: MonthlyRow[],
  numeratorKey: keyof MonthlyRow,
  denominatorKey: keyof MonthlyRow
): { month: string; value: number }[] {
  return data.map((_, idx) => {
    const start = Math.max(0, idx - 11);
    const slice = data.slice(start, idx + 1);
    const numerator = slice.reduce((sum, row) => sum + (row[numeratorKey] as number), 0);
    const denominator = slice.reduce((sum, row) => sum + (row[denominatorKey] as number), 0);
    const value = denominator !== 0 ? (numerator / denominator) * 100 : 0;
    return { month: data[idx].month, value: Math.round(value * 10) / 10 };
  });
}

/** YoY % change: latest month vs same month 12 periods prior. Returns 0 if data < 13 rows. */
export function calcYoY(data: MonthlyRow[], key: keyof MonthlyRow): number {
  if (data.length < 13) return 0;
  const latest = data[data.length - 1][key] as number;
  const priorYear = data[data.length - 13][key] as number;
  if (priorYear === 0) return 0;
  return Math.round(((latest - priorYear) / priorYear) * 1000) / 10;
}

/** Build all KpiMetric objects from the raw data, driven by METRIC_CONFIG. */
export function buildAllKpis(data: MonthlyRow[]): KpiMetric[] {
  if (data.length === 0) return [];

  return METRIC_CONFIG.map((config) => {
    let chartData: { month: string; value: number }[];
    let value: number;
    let yoyChange: number;

    if (config.calcType === "ltm" && config.key) {
      const series = calcLtmSeries(data, config.key);
      chartData = series;
      value = series[series.length - 1]?.value ?? 0;
      yoyChange = calcYoY(data, config.key);
    } else if (
      config.calcType === "margin" &&
      config.numeratorKey &&
      config.denominatorKey
    ) {
      const series = calcMarginSeries(data, config.numeratorKey, config.denominatorKey);
      chartData = series;
      value = series[series.length - 1]?.value ?? 0;

      // YoY for margin: compare latest LTM margin vs LTM margin 12 months prior
      if (data.length >= 13) {
        const priorData = data.slice(0, data.length - 12);
        const priorSeries = calcMarginSeries(
          priorData,
          config.numeratorKey,
          config.denominatorKey
        );
        const priorValue = priorSeries[priorSeries.length - 1]?.value ?? 0;
        yoyChange =
          priorValue !== 0
            ? Math.round(((value - priorValue) / priorValue) * 1000) / 10
            : 0;
      } else {
        yoyChange = 0;
      }
    } else {
      chartData = [];
      value = 0;
      yoyChange = 0;
    }

    return {
      id: config.id,
      title: config.title,
      value,
      unit: config.unit,
      yoyChange,
      chartData,
      color: config.color,
    };
  });
}
