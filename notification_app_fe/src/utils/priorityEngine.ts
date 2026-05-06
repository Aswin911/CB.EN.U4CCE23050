import { Notification } from "../api/notifications";

export interface ScoredNotification extends Notification {
  score: number;
  rank: number;
}

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function computePriority(
  notifications: Notification[],
  topN: number = 10
): ScoredNotification[] {
  const now = Date.now();

  const scored = notifications.map((n) => {
    const typeWeight = TYPE_WEIGHT[n.Type] ?? 0;
    const ageMs = now - new Date(n.Timestamp).getTime();
    const recencyScore = Math.max(0, 1 - ageMs / 86400000);
    const score = typeWeight + recencyScore;
    return { ...n, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN).map((n, index) => ({
    ...n,
    rank: index + 1,
  }));
}
