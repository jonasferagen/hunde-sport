// lib/logger.ts
import { logger, type transportFunctionType } from "react-native-logs";

type Severity = "debug" | "info" | "warn" | "error" | "verbose" | "silent";
type LogInstance = ReturnType<typeof logger.createLogger>;

let logInstance: LogInstance = logger.createLogger({ enabled: false });

export function configureLogger(options: {
  severity?: Severity;
  transport?: transportFunctionType<any>;
  enabled?: boolean;
}) {
  logInstance = logger.createLogger({
    severity: options.severity ?? "debug",
    transport: options.transport,
    enabled: options.enabled ?? true,
  });
}

export const log: LogInstance = new Proxy({} as LogInstance, {
  // delegate every call (debug/info/warn/error, etc.) to the current instance
  get(_t, prop) {
    // @ts-expect-error dynamic proxy to underlying logger instance
    return logInstance[prop];
  },
});
