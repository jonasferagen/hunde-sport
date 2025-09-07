// @/lib/query/query.ts
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import React from "react";

import type { Page } from "./responseTransformer";

export const makeQueryOptions = <T>() => ({
  initialPageParam: 1 as const,
  getNextPageParam: (lastPage: Page<T>) => {
    const { page, totalPages } = lastPage ?? {};
    if (!page || !totalPages) return undefined; // bail if metadata missing
    return page < totalPages ? page + 1 : undefined;
  },
});

export type QueryResult<T> = Omit<UseInfiniteQueryResult<T>, "data"> & {
  total: number;
  totalPages: number;
  pageCount: number; // The current page when loading results
  items: T[];
};

export const useQueryResult = <T extends { id: number }>(
  result: UseInfiniteQueryResult<any, any>
): QueryResult<T> => {
  const { data: dataResult, ...rest } = result;
  if (result.error) {
    console.error(result.error);
  }

  const computed = React.useMemo(() => {
    const pages: Page<T>[] = (dataResult?.pages ?? []) as Page<T>[];

    const indexById = new Map<number, number>();
    const items: T[] = [];

    for (const page of pages) {
      // collect items (dedupe by id)
      for (const item of page.data ?? []) {
        const idx = indexById.get(item.id);
        if (idx === undefined) {
          indexById.set(item.id, items.length);
          items.push(item);
        } else {
          items[idx] = item;
        }
      }
    }

    const pageCount = pages.length;
    const last = pages.length ? pages[pages.length - 1] : null;
    const total = last?.total ?? 0;
    const totalPages = last?.totalPages ?? 0;

    return { items, total, totalPages, pageCount };
  }, [dataResult?.pages]);

  return { ...rest, ...computed };
};

type AutoPaginateOpts = {
  enabled?: boolean;
  // if you want "push through offline pauses", set ignorePaused: true
  ignorePaused?: boolean;
};

export function useAutoPaginateQueryResult<T>(
  q: QueryResult<T>,
  opts: AutoPaginateOpts = {}
) {
  const {
    status,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    fetchStatus,
    pageCount,
  } = q as unknown as {
    status: "pending" | "error" | "success";
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => Promise<unknown>;
    fetchStatus: "fetching" | "paused" | "idle";
    pageCount: number;
  };

  const { enabled = true } = opts;

  React.useEffect(() => {
    if (!enabled) return;
    if (status !== "success") return; // wait for first page
    if (!hasNextPage) return; // done
    if (fetchStatus === "paused") return; // offline, etc.
    if (isFetchingNextPage) return; // already fetching

    void fetchNextPage();
  }, [
    enabled,
    status,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    fetchStatus,
    pageCount, // 👈 pulse when a new page lands
  ]);
}
