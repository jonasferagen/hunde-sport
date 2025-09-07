// @/lib/query/responseTransformer.ts
import * as Sentry from "@sentry/react-native";
import type { ApiResponse } from "apisauce";

type PageMeta = { page: number; totalPages: number; total?: number };
export type Page<T> = { data: T[] } & PageMeta;

export const responseTransformer = <T>(
  response: ApiResponse<any, any>,
  mapper: (item: any) => T
): Page<T> => {
  const totalPages = Number(response.headers?.["x-wp-totalpages"] ?? 0) || 0;
  const total = Number(response.headers?.["x-wp-total"] ?? 0) || 0;

  const src = Array.isArray(response.data) ? response.data : [];
  const data: T[] = [];

  // Pull minimal request context (if present)
  const { baseURL, url, method, params } = response.config ?? {};
  const endpoint = baseURL ? `${baseURL}${url ?? ""}` : url;

  for (let i = 0; i < src.length; i++) {
    const raw = src[i];
    try {
      data.push(mapper(raw));
    } catch (e: any) {
      if (__DEV__) {
        // Keep it terse but useful for repro

        console.warn(
          `[map fail] #${i} id=${raw?.id} type=${raw?.type} -> ${e?.message ?? e}`
        );

        throw e; // preserve original stack/type
      }

      // Prod: capture, skip item
      Sentry.captureException(e, (scope) => {
        scope.setTag("component", "responseTransformer");
        if (method) scope.setTag("method", String(method).toUpperCase());
        if (endpoint) scope.setTag("endpoint", endpoint);
        if (params) scope.setExtra("params", params);
        scope.setExtra("index", i);
        scope.setExtra("raw", raw);
        return scope;
      });

      // continue; (skip the bad item)
    }
  }

  return { data, totalPages, total };
};
