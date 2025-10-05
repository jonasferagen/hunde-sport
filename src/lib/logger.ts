// lib/logger.ts
import { logger, type transportFunctionType } from "react-native-logs";

type Severity = "debug" | "info" | "warn" | "error";
type Logger = { [K in Severity]: (...args: unknown[]) => void };

const supportedSeverities: Severity[] = ["debug", "info", "warn", "error"];

// Start with no-ops, so calls are always defined pre-bootstrap.
let currentLogger: Logger = Object.fromEntries(supportedSeverities.map((severity) => [severity, (..._args: unknown[]) => {}])) as Logger;

export function configureLogger(configureLoggerOptions: {
  severity?: "debug" | "info" | "warn" | "error" | "verbose" | "silent";
  transport?: transportFunctionType<any>;
  enabled?: boolean;
}) {
  const created = logger.createLogger({
    severity: configureLoggerOptions.severity ?? "debug",
    transport: configureLoggerOptions.transport,
    enabled: configureLoggerOptions.enabled ?? true,
  }) as Record<string, (...args: unknown[]) => void>;

  // Normalize to our guaranteed shape (fill gaps with no-ops).
  currentLogger = Object.fromEntries(supportedSeverities.map((severity) => [severity, created[severity] ?? (() => {})])) as Logger;
}

// Stable facade that forwards to the current instance.
export const log: Logger = Object.fromEntries(
  supportedSeverities.map((severity) => [severity, (...args: unknown[]) => currentLogger[severity](...args)])
) as Logger;
