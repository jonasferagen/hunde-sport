// @/lib/query/query.ts
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import React from "react";

import type { Page } from "./responseTransformer";

export const makeQueryOptions = <T>() => {
  return {
    //  placeHolderData: (prev: QueryResult<T>) => prev,
    initialPageParam: 1,
    getNextPageParam: (lastPage: Page<T>, allPages: Page<T>[]) => {
      const nextPage = allPages.length + 1;
      const totalPages = lastPage?.totalPages;
      const out = totalPages && nextPage <= totalPages ? nextPage : undefined;
      return out;
    },
  };
};

export type QueryResult<T> = Omit<UseInfiniteQueryResult<T>, "data"> & {
  total: number;
  totalPages: number;
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

    const last = pages.length ? pages[pages.length - 1] : null;
    const total = last?.total ?? 0;
    const totalPages = last?.totalPages ?? 0;

    return { items, total, totalPages };
  }, [dataResult?.pages]);

  return { ...rest, ...computed };
};
