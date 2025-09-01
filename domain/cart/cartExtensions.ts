// domain/cart/cartExtensions.ts
export type FpfValues = Record<string, string>;

type LineItemLike = {
  extensions?: {
    app_fpf?: {
      values?: FpfValues | Record<string, never>;
    } | null;
  } | null;
};

export function getFpfValuesFromLineItem(
  lineItem: LineItemLike | null | undefined
): FpfValues | undefined {
  const vals = lineItem?.extensions?.app_fpf?.values;
  // Treat empty object as “no values”
  return vals && Object.keys(vals).length > 0 ? (vals as FpfValues) : undefined;
}

export function hasAnyFpfValues(
  lineItem: LineItemLike | null | undefined
): boolean {
  return !!getFpfValuesFromLineItem(lineItem);
}
