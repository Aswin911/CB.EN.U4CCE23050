"use client";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { Notification } from "../api/notifications";
import { markAsViewed, isViewed } from "../state/notificationStore";
import { Log } from "../middleware/logger";

const TYPE_COLOR: Record<string, "success" | "warning" | "info"> = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

interface Props {
  notification: Notification;
  rank?: number;
  score?: number;
  onViewed?: (id: string) => void;
}

export default function NotificationCard({
  notification,
  rank,
  score,
  onViewed,
}: Props) {
  const [viewed, setViewed] = React.useState(false);

  React.useEffect(() => {
    setViewed(isViewed(notification.ID));
  }, [notification.ID]);

  const handleClick = async () => {
    if (!viewed) {
      markAsViewed(notification.ID);
      setViewed(true);
      await Log(
        "info",
        "state",
        `notification marked as viewed: ${notification.ID}`
      );
      onViewed?.(notification.ID);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        mb: 1.5,
        cursor: "pointer",
        opacity: viewed ? 0.6 : 1,
        backgroundColor: viewed ? "#f5f5f5" : "#ffffff",
        border: viewed ? "1px solid #ddd" : "1px solid #1976d2",
        transition: "all 0.2s ease",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {rank && (
              <Typography variant="h6" color="primary" fontWeight={700}>
                #{rank}
              </Typography>
            )}
            <Chip
              label={notification.Type}
              color={TYPE_COLOR[notification.Type] ?? "default"}
              size="small"
            />
            {!viewed && (
              <Chip label="NEW" color="error" size="small" variant="filled" />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {notification.Timestamp}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mt: 1, fontWeight: viewed ? 400 : 600 }}>
          {notification.Message}
        </Typography>

        {score !== undefined && (
          <Typography variant="caption" color="text.secondary">
            Priority Score: {score.toFixed(4)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
