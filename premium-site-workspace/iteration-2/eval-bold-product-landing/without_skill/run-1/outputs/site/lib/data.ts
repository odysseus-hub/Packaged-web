/** Illustrative data for the proof section. Deterministic so server and client render identically. */

export const latencyWeeks: { week: number; p95: number }[] = [
  812, 846, 798, 905, 702, 584, 497, 441, 389, 344, 311, 279, 252, 231, 211, 196,
].map((p95, i) => ({ week: i + 1, p95 }));

/** Week index (1-based) Relay was switched on. */
export const relayInstalledWeek = 4;

// 90 days of uptime %, oldest first. Incidents cluster early and fade as the team fixes root causes.
const incidents: Record<number, number> = {
  2: 98.4, 6: 99.31, 9: 97.6, 15: 99.12, 21: 98.9, 28: 99.64, 37: 99.5, 46: 99.82, 58: 99.9, 74: 99.95,
};
export const uptimeDays: number[] = Array.from({ length: 90 }, (_, i) => incidents[i] ?? 100);

export const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

export const downtimeByMonth = [
  { label: "Mo 1", minutes: 47 },
  { label: "Mo 2", minutes: 31 },
  { label: "Mo 3", minutes: 18 },
  { label: "Mo 4", minutes: 11 },
  { label: "Mo 5", minutes: 7 },
  { label: "Mo 6", minutes: 4 },
];
