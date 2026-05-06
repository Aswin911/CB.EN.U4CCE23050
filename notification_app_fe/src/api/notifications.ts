"use client";
import axios from "axios";
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

export async function fetchNotifications(
  params: FetchParams = {}
): Promise<Notification[]> {
  const BASE = process.env.NEXT_PUBLIC_API_BASE;
  const TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;

  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.page) query.set("page", String(params.page));
  if (params.notification_type && params.notification_type !== "All") {
    query.set("notification_type", params.notification_type);
  }

  const url = `${BASE}/notifications?${query.toString()}`;

  await Log("info", "api", "fetching notifications from server");

  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const notifications: Notification[] = res.data.notifications;
    await Log("info", "api", `got ${notifications.length} notifications`);
    return notifications;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await Log("fatal", "api", `fetch failed: ${msg}`);
    throw err;
  }
}
