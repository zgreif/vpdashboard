"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Measures the chart container width via ResizeObserver and returns
 * font sizes that scale proportionally with the chart size.
 *
 * Attach `containerRef` to the outermost wrapper div of the chart.
 */
export function useChartMeasure() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560); // sensible server-side default

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return {
    containerRef,
    // Labels above bars / data points: 10–16px
    labelFontSize: Math.max(10, Math.min(16, Math.round(width * 0.024))),
    // X-axis tick labels: 8–12px
    tickFontSize: Math.max(8, Math.min(12, Math.round(width * 0.016))),
  };
}
