// @/lib/query/responseTransformer.ts
import * as Sentry from "@sentry/react-native";
import { ApiResponse } from "apisauce";

export type Page<T> = {
  data: T[];
  totalPages: number;
  total: number;
};

export const responseTransformer = <T>(
  response: ApiResponse<any, any>,
  mapper: (item: any) => T
): Page<T> => {
  const totalPages = Number(response.headers?.["x-wp-totalpages"] ?? 0) || 0;
  const total = Number(response.headers?.["x-wp-total"] ?? 0) || 0;

  const src = Array.isArray(response.data) ? response.data : [];
  const data: T[] = [];

  for (let i = 0; i < src.length; i++) {
    const raw = src[i];
    try {
      data.push(mapper(raw));
    } catch (e: any) {
      if (__DEV__) {
        console.warn(raw);
        throw e.message;
      }
      const req = response.config ?? {};
      // Send the same context to Sentry (optional, but recommended)
      Sentry.captureException(e, (scope) => {
        scope.setTag("component", "responseTransformer");
        scope.setExtra("request", req);
        scope.setExtra("index", i);
        scope.setExtra("raw", raw);
        return scope;
      });
    }
  }

  return { data, totalPages, total };
};
