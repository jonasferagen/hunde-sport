// lib/logger.ts

import { consoleTransport, logger } from "react-native-logs";

const config = {
  severity: "debug",
  transport: consoleTransport,
};

export const log = logger.createLogger(config);
