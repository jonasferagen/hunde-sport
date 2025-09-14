import React from "react";
import { View as RNView } from "react-native";

import {
  ProductAvailabilityStatus,
  ProductPrice,
} from "@/components/features/product/ui";
import { TileBadge } from "@/components/ui/Badge";
import { ThemedYStack } from "@/components/ui/themed";
import { THEME_PRICE_TAG } from "@/config/app";
import { Purchasable } from "@/types";

import { FixedTile } from "../FixedTile";

export interface HorizontalTileItemProps {
  item: any; // PurchasableProduct, but keep loose here if you reuse
  index: number;
  gapPx: number;
  itemW: number;
  itemH: number;
  onPress: () => void;
}

export const HorizontalTileItem: React.FC<HorizontalTileItemProps> = ({
  item,
  index,
  gapPx,
  itemW,
  itemH,
  onPress,
}) => {
  const purchasable = Purchasable.create({ product: item });

  return (
    <RNView style={{ marginRight: gapPx, width: itemW, height: itemH }}>
      <FixedTile
        onPress={onPress}
        title={item.name}
        image={item.featuredImage}
        w={itemW}
        h={itemH}
        imagePriority={index < 3 ? "high" : "low"}
      >
        {!item.availability.isInStock && (
          <ThemedYStack
            bg="$background"
            fullscreen
            pos="absolute"
            o={0.4}
            pointerEvents="none"
          />
        )}

        <TileBadge theme={THEME_PRICE_TAG} corner="tr">
          <ProductAvailabilityStatus
            productAvailability={item.availability}
            showInStock={false}
          />
          <ProductPrice purchasable={purchasable} showIcon />
        </TileBadge>
      </FixedTile>
    </RNView>
  );
};
HorizontalTileItem.displayName = "HorizontalTileItem";
