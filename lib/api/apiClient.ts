// src/lib/apiClient.ts
import { type ApiResponse, create } from "apisauce";

import { BASE_URL } from "@/config/app";
import { log } from "@/lib/logger";

import { ApiError, isRetriable } from "./httpError";

const apiClient = create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
  timeout: 15000, // important on mobile
});

// Central monitor
apiClient.addMonitor((response: ApiResponse<any>) => {
  const { config, problem, duration, status } = response;
  const { method, url } = config || {};
  if (problem) {
    log.error("API Response Error", {
      method,
      url,
      problem,
      status,
      duration,
      data: response.data,
    });
  }
});

// Normalize ALL failures to ApiError (so query retry logic is consistent)
apiClient.addResponseTransform((response) => {
  if (!response.ok) {
    const status = response.status;
    const problem = response.problem;
    const message =
      (typeof response.data === "object" && response.data?.message) ||
      `HTTP ${status ?? "error"}`;
    throw new ApiError(message, {
      status,
      problem,
      retriable: isRetriable(problem, status),
      isNetworkError:
        problem === "NETWORK_ERROR" ||
        problem === "CONNECTION_ERROR" ||
        problem === "TIMEOUT_ERROR",
    });
  }
});

export { apiClient };
