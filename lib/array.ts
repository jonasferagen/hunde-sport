import type { NonEmptyArray } from "@/types";

export function toNonEmptyArray<T>(items: readonly T[] | null | undefined, fallback: T): NonEmptyArray<T> {
  return (items && items.length ? items : [fallback]) as NonEmptyArray<T>;
}
