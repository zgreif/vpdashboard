/**
 * Shared chart appearance constants.
 * Import from here in every chart component — one change updates everything.
 */

/** width ÷ height ratio — maintained as the card resizes */
export const CHART_ASPECT = 2.5;
/** Chart height is clamped between these values regardless of card width */
export const CHART_MIN_HEIGHT = 150;
export const CHART_MAX_HEIGHT = 380;

export const CHART_MARGIN = {
  top: 30,
  right: 22,
  left: 22,
  bottom: 0,
} as const;

export const BAR_CHART_MARGIN = {
  top: 30,
  right: 8,
  left: 0,
  bottom: 0,
} as const;

export const LABEL_STYLE = {
  fontSize: 12,
  fill: "var(--foreground)",
  fontWeight: 600 as const,
};

export const AXIS_TICK_STYLE = {
  fontSize: 9,
  fill: "var(--foreground)",
};

export const BAR_CATEGORY_GAP = "6%";
export const BAR_RADIUS: [number, number, number, number] = [3, 3, 0, 0];

/** "Jan 2024" → "Jan'24" — shared format for all chart x-axes */
export function formatMonthLabel(month: string): string {
  if (month.startsWith("Q")) return month; // already a quarter label
  const [mon, year] = month.split(" ");
  return `${mon ?? ""}'${(year ?? "").slice(2)}`;
}
