"use client";
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Log } from "../middleware/logger";

const FILTERS = ["All", "Placement", "Result", "Event"];

interface Props {
  active: string;
  onChange: (filter: string) => void;
}

export default function FilterBar({ active, onChange }: Props) {
  const handleChange = async (filter: string) => {
    await Log("info", "component", `filter changed to ${filter.toLowerCase()}`);
    onChange(filter);
  };

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
      {FILTERS.map((f) => (
        <Button
          key={f}
          variant={active === f ? "contained" : "outlined"}
          size="small"
          onClick={() => handleChange(f)}
        >
          {f}
        </Button>
      ))}
    </Box>
  );
}
