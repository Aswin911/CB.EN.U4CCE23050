import axios from "axios";

type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
    | "cache" | "controller" | "cron_job" | "db" | "domain"
    | "handler" | "repository" | "route" | "service"
    | "api" | "component" | "hook" | "page" | "state" | "style"
    | "auth" | "config" | "middleware" | "utils";

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

export async function Log(
    stack: Stack,
    level: Level,
    pkg: Package,
    message: string
): Promise<void> {
    try {
        const token = process.env.BEARER_TOKEN;
        await axios.post(
            LOG_API,
            { stack, level, package: pkg, message },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch {
        // silent fail — logger must never crash the app
    }
}