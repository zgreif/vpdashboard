"use client";

import { useState, useEffect, useCallback } from "react";
import type { MonthlyRow, KpiMetric } from "@/types";
import { SAMPLE_DATA, loadFromStorage, saveToStorage } from "@/lib/data";
import { buildAllKpis } from "@/lib/calculations";

interface UseKpiDataReturn {
  data: MonthlyRow[];
  metrics: KpiMetric[];
  updateData: (rows: MonthlyRow[]) => void;
  resetData: () => void;
}

/**
 * Central data hook — single source of truth for all pages.
 * Loads from localStorage on mount, falls back to sample data.
 */
export function useKpiData(): UseKpiDataReturn {
  const [data, setData] = useState<MonthlyRow[]>(SAMPLE_DATA);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored && stored.length > 0) {
      setData(stored);
    }
  }, []);

  const metrics = buildAllKpis(data);

  const updateData = useCallback((rows: MonthlyRow[]) => {
    setData(rows);
    saveToStorage(rows);
  }, []);

  const resetData = useCallback(() => {
    setData(SAMPLE_DATA);
    saveToStorage(SAMPLE_DATA);
  }, []);

  return { data, metrics, updateData, resetData };
}
