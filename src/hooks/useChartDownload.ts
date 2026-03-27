"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";

/**
 * Returns a ref to attach to any DOM element and a download() function
 * that captures that element as a PNG and triggers a browser download.
 */
export function useChartDownload(title: string) {
  const ref = useRef<HTMLDivElement>(null);

  async function download() {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Chart download failed:", err);
    }
  }

  return { ref, download };
}
