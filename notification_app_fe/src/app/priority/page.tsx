"use client";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NotificationCard from "../../components/NotificationCard";
import FilterBar from "../../components/FilterBar";
import { fetchNotifications } from "../../api/notifications";
import { computePriority, ScoredNotification } from "../../utils/priorityEngine";
import { Log } from "../../middleware/logger";

export default function PriorityInboxPage() {
  const [filter, setFilter] = useState("All");
  const [topN, setTopN] = useState(10);
  const [notifications, setNotifications] = useState<ScoredNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Log("info", "page", "priority inbox page loaded");
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      await Log(
        "debug",
        "utils",
        `computing priority with filter ${filter.toLowerCase()} and topn ${topN}`
      );
      try {
        const params =
          filter === "All" ? {} : { notification_type: filter };
        const raw = await fetchNotifications(params);
        const prioritized = computePriority(raw, topN);
        setNotifications(prioritized);
        await Log(
          "info",
          "utils",
          `priority inbox ready with ${prioritized.length} notifications`
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await Log("error", "page", `priority inbox load failed: ${msg}`);
        setError("failed to load priority notifications.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filter, topN]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Priority Inbox
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2, flexWrap: "wrap" }}>
        <FilterBar active={filter} onChange={setFilter} />
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Top N</InputLabel>
          <Select
            value={topN}
            label="Top N"
            onChange={(e) => setTopN(Number(e.target.value))}
          >
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading &&
        !error &&
        notifications.map((n) => (
          <NotificationCard
            key={n.ID}
            notification={n}
            rank={n.rank}
            score={n.score}
          />
        ))}
    </Box>
  );
}
