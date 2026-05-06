type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service" | "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";
export declare function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void>;
export {};
