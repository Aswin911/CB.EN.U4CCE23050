const STORAGE_KEY = "viewed_notification_ids";

function getViewed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveViewed(ids: Set<string>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function markAsViewed(id: string): void {
  const viewed = getViewed();
  viewed.add(id);
  saveViewed(viewed);
}

export function isViewed(id: string): boolean {
  return getViewed().has(id);
}

export function getViewedIds(): Set<string> {
  return getViewed();
}
