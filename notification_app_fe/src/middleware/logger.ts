"use client";
import axios from "axios";

type Level = "debug" | "info" | "warn" | "error" | "fatal";
type FrontendPackage =
  | "api" | "component" | "hook" | "page"
  | "state" | "style" | "auth" | "config"
  | "middleware" | "utils";

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

export async function Log(
  level: Level,
  pkg: FrontendPackage,
  message: string
): Promise<void> {
  try {
    const token = process.env.NEXT_PUBLIC_BEARER_TOKEN;
    await axios.post(
      LOG_API,
      { stack: "frontend", level, package: pkg, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch {
    // silent fail
  }
}
