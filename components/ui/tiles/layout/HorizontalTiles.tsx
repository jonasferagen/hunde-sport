// File: components/tiles/HorizontalTiles.tsx
import React from "react";
import type { StackProps } from "tamagui";

import type { QueryResult } from "@/lib/api/query";
import type { PurchasableProduct } from "@/types";

import { HorizontalTilesList } from "./HorizontalTilesList";
import { useHorizontalTiles } from "./useHorizontalTiles";

export interface HorizontalTilesProps extends StackProps {
  queryResult: QueryResult<PurchasableProduct>;
  limit: number; // kept for parity; use upstream
  estimatedItemSize?: number; // item width
  estimatedItemCrossSize?: number; // item height
  gapToken?: StackProps["gap"];
  padToken?: StackProps["p"];
  leadingInsetToken?: StackProps["p"];
  indicatorWidthToken?: StackProps["w"];
}

export function HorizontalTiles(props: HorizontalTilesProps) {
  const hook = useHorizontalTiles(props);
  const { items: products } = props.queryResult;
  if (!products?.length) return <></>;

  return (
    <HorizontalTilesList
      {...hook.containerProps}
      listProps={hook.listProps}
      overlayProps={hook.overlayProps}
    />
  );
}
