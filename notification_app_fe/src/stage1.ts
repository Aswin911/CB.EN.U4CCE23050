import axios from "axios";
import * as dotenv from "dotenv";
import path from "path";
import { Log } from "../../logging_middleware/src/index";
import { computePriority, Notification } from "./utils/priorityEngine";

// Load .env.local from the notification_app_fe root
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const BASE = "http://20.207.122.201/evaluation-service";

// .env.local uses NEXT_PUBLIC_BEARER_TOKEN; alias it so the Log() internals
// (which read process.env.BEARER_TOKEN) also work in this Node context.
const TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;
if (TOKEN) {
  process.env.BEARER_TOKEN = TOKEN;
}

async function fetchNotifications(): Promise<Notification[]> {
  await Log("frontend", "info", "api", "stage 1: fetching all notifications from test server");

  const res = await axios.get(`${BASE}/notifications`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  const notifications: Notification[] = res.data.notifications;
  await Log(
    "frontend",
    "info",
    "api",
    `fetched ${notifications.length} total notifications`
  );
  return notifications;
}

async function runStage1() {
  console.log("\n============================================");
  console.log("    STAGE 1 — PRIORITY INBOX (TOP 10)     ");
  console.log("============================================\n");

  await Log("frontend", "info", "utils", "stage 1 priority inbox computation started");

  const notifications = await fetchNotifications();
  const top10 = computePriority(notifications, 10);

  await Log(
    "frontend",
    "debug",
    "utils",
    `priority computed. top 10 selected from ${notifications.length} notifications`
  );

  console.log(`Total notifications fetched : ${notifications.length}`);
  console.log(`Returning top 10 by priority score\n`);
  console.log("--------------------------------------------");

  top10.forEach((n) => {
    console.log(`Rank   : #${n.rank}`);
    console.log(`Type   : ${n.Type}`);
    console.log(`Message: ${n.Message}`);
    console.log(`Time   : ${n.Timestamp}`);
    console.log(`Score  : ${n.score.toFixed(6)}`);
    console.log("--------------------------------------------");
  });

  await Log(
    "frontend",
    "info",
    "utils",
    "stage 1 completed. top 10 priority notifications displayed."
  );

}

runStage1().catch(async (err: Error) => {
  console.error("❌ Stage 1 failed:", err.message);
  await Log("frontend", "fatal", "utils", `stage 1 runner crashed: ${err.message}`);
  process.exit(1);
});
