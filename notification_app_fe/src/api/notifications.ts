import { Log } from "../middleware/logger";

export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

interface FetchParams {
  limit?: number;
  page?: number;
  notification_type?: string;
}

const BASE = process.env.NEXT_PUBLIC_API_BASE;
const TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;

export async function fetchNotifications(
  params: FetchParams = {}
): Promise<Notification[]> {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.page) query.set("page", String(params.page));
  if (params.notification_type && params.notification_type !== "All") {
    query.set("notification_type", params.notification_type);
  }

  const url = `${BASE}/notifications?${query.toString()}`;

  await Log("info", "api", `fetching notifications from test server`);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });

    if (!res.ok) {
      await Log("error", "api", `fetch failed with status ${res.status}`);
      throw new Error(`http error: ${res.status}`);
    }

    const data = await res.json();
    await Log(
      "info",
      "api",
      `fetched ${data.notifications.length} notifications`
    );
    return data.notifications;
  } catch (err) {
    await Log("fatal", "api", `network error while fetching notifications: ${String(err)}`);
    throw err;
  }
}
