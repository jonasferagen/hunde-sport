// lib/apiClient.ts
import { type ApiResponse, type ApisauceInstance, create } from "apisauce";

import { log } from "@/lib/logger";

import { ApiError, isRetriable } from "./httpError";

type ApiClientOptions = {
  baseURL: string;
  timeoutMs?: number;
  enableLogging?: boolean;
  defaultHeaders?: Record<string, string>;
  getAuthToken?: (() => string | null | Promise<string | null>) | null;
};

let apiClientInstance: ApisauceInstance | null = null;
// Prevent duplicate monitors on reconfigure/hot-reload:
const monitoredClients = new WeakSet<ApisauceInstance>();

export function configureApiClient(options: ApiClientOptions): void {
  const {
    baseURL,
    timeoutMs = 15_000,
    enableLogging = true,
    defaultHeaders,
    getAuthToken,
  } = options;

  const client = create({
    baseURL,
    headers: { Accept: "application/json", ...(defaultHeaders ?? {}) },
    timeout: timeoutMs,
  });

  // Optional auth header (kept here so domain stays clean)
  if (getAuthToken) {
    client.addAsyncRequestTransform(async (req) => {
      const token = await getAuthToken();
      if (token) {
        req.headers = {
          ...(req.headers ?? {}),
          Authorization: `Bearer ${token}`,
        };
      }
    });
  }

  // Central monitor (once per client)
  if (enableLogging && !monitoredClients.has(client)) {
    client.addMonitor((response: ApiResponse<any>) => {
      const { config, problem, duration, status } = response;
      const { method, url } = config || {};
      if (problem) {
        log.error &&
          typeof log.error === "function" &&
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
    monitoredClients.add(client);
  }

  // Normalize ALL failures to ApiError (consistent retry logic)
  client.addResponseTransform((response) => {
    if (!response.ok) {
      const status = response.status;
      const problem = response.problem;
      const message =
        (typeof response.data === "object" &&
          (response.data as any)?.message) ||
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

  apiClientInstance = client;
}

export function getApiClient(): ApisauceInstance {
  if (!apiClientInstance) {
    throw new Error(
      "apiClient not configured. Call configureApiClient() during bootstrap.",
    );
  }
  return apiClientInstance;
}
