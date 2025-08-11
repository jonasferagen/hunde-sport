// VariantOrQtySheet.tsx
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { usePurchasable } from '@/hooks/usePurchasable';
import React, { useMemo, useState } from 'react';
import { Button, Label, Separator, Sheet, SizableText, XStack, YStack } from 'tamagui';
// import your variation list / swatches / etc.

type SheetProps = { open: boolean; onOpenChange: (o: boolean) => void };

export const VariantOrQtySheet = ({ open, onOpenChange }: SheetProps) => {
    const { product } = useBaseProductContext();
    const { status, isValid, addToCart, selectedOptions, setOption, priceLabel, fromPriceLabel } = usePurchasable();

    const variable = status === 'ACTION_NEEDED';
    const [qty, setQty] = useState(1);

    const canConfirm = useMemo(() => {
        if (variable) {
            // require all needed options chosen; depends on your hook shape
            return isValid;
        }
        return true;
    }, [variable, isValid]);

    const confirm = async () => {
        await addToCart({ qty }); // your hook/API
        onOpenChange(false);
    };

    return (
        <Sheet modal open={open} onOpenChange={onOpenChange} snapPointsMode="fit" disableDrag>
            <Sheet.Overlay />
            <Sheet.Frame p="$4" gap="$4">
                <YStack gap="$3">
                    <SizableText size="$7" fow="700">{product.name}</SizableText>

                    {variable ? (
                        <YStack gap="$2">
                            {/* Replace with your real controls (swatches, dropdowns, etc.) */}
                            {product.variations?.map((attr: any) => (
                                <YStack key={attr.id} gap="$2">
                                    <Label>{attr.name}</Label>
                                    {/* render options */}
                                    <XStack gap="$2" fwr="wrap">
                                        {attr.options.map((opt: any) => {
                                            const active = selectedOptions[attr.slug] === opt.slug;
                                            return (
                                                <Button
                                                    key={opt.slug}
                                                    size="$3"
                                                    br="$10"
                                                    variant={active ? 'solid' : 'outlined'}
                                                    onPress={() => setOption(attr.slug, opt.slug)}
                                                >
                                                    {opt.name}
                                                </Button>
                                            );
                                        })}
                                    </XStack>
                                </YStack>
                            ))}
                        </YStack>
                    ) : null}

                    <Separator />

                    {/* Quantity */}
                    <XStack ai="center" jc="space-between">
                        <SizableText fow="600">Antall</SizableText>
                        <XStack ai="center" gap="$2">
                            <Button size="$3" onPress={() => setQty(q => Math.max(1, q - 1))}>–</Button>
                            <SizableText w={36} ta="center">{qty}</SizableText>
                            <Button size="$3" onPress={() => setQty(q => q + 1)}>+</Button>
                        </XStack>
                    </XStack>

                    {/* Confirm */}
                    <Button
                        size="$5"
                        br="$8"
                        iconAfter={<Check size={18} />}
                        disabled={!canConfirm}
                        onPress={confirm}
                    >
                        {variable ? 'Velg og legg i handlekurv' : 'Legg i handlekurv'}
                        {` – ${variable ? fromPriceLabel ?? '' : priceLabel ?? ''}`}
                    </Button>
                </YStack>
            </Sheet.Frame>
        </Sheet>
    );
};
