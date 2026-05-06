"use client";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../middleware/logger";

const LIMIT = 10;

export default function AllNotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { notifications, loading, error } = useNotifications({
    limit: LIMIT,
    page,
    notification_type: filter === "All" ? undefined : filter,
  });

  useEffect(() => {
    Log("info", "page", "all notifications page loaded");
  }, []);

  const handleFilterChange = (f: string) => {
    setFilter(f);
    setPage(1);
  };

  const handlePageChange = async (_: React.ChangeEvent<unknown>, value: number) => {
    await Log("info", "component", `pagination moved to page ${value}`);
    setPage(value);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        All Notifications
      </Typography>

      <FilterBar active={filter} onChange={handleFilterChange} />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading && !error &&
        notifications.map((n) => (
          <NotificationCard key={n.ID} notification={n} />
        ))}

      {!loading && !error && notifications.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={10}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
