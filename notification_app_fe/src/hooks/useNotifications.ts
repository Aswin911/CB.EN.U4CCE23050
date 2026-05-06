"use client";
import { useState, useEffect } from "react";
import { fetchNotifications, Notification } from "../api/notifications";
import { Log } from "../middleware/logger";

interface Params {
  limit?: number;
  page?: number;
  notification_type?: string;
}

export function useNotifications(params: Params = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      await Log("info", "hook", "loading notifications");
      try {
        const data = await fetchNotifications(params);
        setNotifications(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await Log("error", "hook", `failed to load notifications: ${msg}`);
        setError("could not load notifications, check your connection and try again");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.limit, params.page, params.notification_type]);

  return { notifications, loading, error };
}
