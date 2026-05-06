export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

export interface ScoredNotification extends Notification {
  score: number;
  rank: number;
}

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Scores and ranks notifications by priority.
 * score = typeWeight + recencyScore
 * recencyScore = Math.max(0, 1 - ageInMs / 86400000)
 *
 * For efficient maintenance as new notifications arrive,
 * a min-heap of size topN would keep this O(n log k) — see design doc.
 * For this submission we use a full sort (O(n log n)) which is correct
 * and clear; the heap approach is described in the design doc.
 */
export function computePriority(
  notifications: Notification[],
  topN: number = 10
): ScoredNotification[] {
  const now = Date.now();

  const scored = notifications.map((n) => {
    const typeWeight = TYPE_WEIGHT[n.Type] ?? 0;
    const ageMs = now - new Date(n.Timestamp).getTime();
    const recencyScore = Math.max(0, 1 - ageMs / 86400000); // 86400000 = 24h in ms
    const score = typeWeight + recencyScore;
    return { ...n, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN).map((n, index) => ({
    ...n,
    rank: index + 1,
  }));
}
