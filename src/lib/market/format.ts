/**
 * Number/date formatting helpers used by the market UI.
 *
 * All currency formatting assumes Indian-locale grouping (24,339.60).
 * All dates assume IST (Asia/Kolkata) and an `en-IN` presentation.
 */

const IN_LOCALE = "en-IN";
const IST = "Asia/Kolkata";

const inFmt = new Intl.NumberFormat(IN_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const signedFmt = new Intl.NumberFormat(IN_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

const percentFmt = new Intl.NumberFormat(IN_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

const croresFmt = new Intl.NumberFormat(IN_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

export function formatIndexValue(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return inFmt.format(value);
}

export function formatChange(change: number): string {
  if (!Number.isFinite(change)) return "—";
  return signedFmt.format(change);
}

export function formatChangePercent(changePercent: number): string {
  if (!Number.isFinite(changePercent)) return "—";
  return `${percentFmt.format(changePercent)}%`;
}

export function formatCrores(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `${croresFmt.format(value)} Cr.`;
}

/** Compact date+time, e.g. "17 Aug 2026, 03:14 PM" (en-IN, IST). */
export function formatDateTimeIST(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/** Short date, e.g. "14 Aug 2026" (en-IN, IST). */
export function formatDateIST(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Time only, e.g. "03:14 PM". */
export function formatTimeIST(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/** Day of month, e.g. "14". */
export function formatDay(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    day: "2-digit",
  }).format(d);
}
