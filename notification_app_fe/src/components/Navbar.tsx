"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { usePathname, useRouter } from "next/navigation";
import { Log } from "../middleware/logger";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navigate = async (path: string, label: string) => {
    await Log("info", "component", `navigating to ${label.toLowerCase()}`);
    router.push(path);
  };

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        <NotificationsIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Campus Notifications
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate("/", "All Notifications")}
            sx={{
              fontWeight: pathname === "/" ? 700 : 400,
              borderBottom: pathname === "/" ? "2px solid white" : "none",
            }}
          >
            All Notifications
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/priority", "Priority Inbox")}
            sx={{
              fontWeight: pathname === "/priority" ? 700 : 400,
              borderBottom:
                pathname === "/priority" ? "2px solid white" : "none",
            }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
