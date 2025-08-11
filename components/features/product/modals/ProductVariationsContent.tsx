import { ThemedYStack } from '@/components/ui';
import { useModalContext, usePurchasableContext } from "@/contexts";
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { VariableProduct } from "@/types";
import React from 'react';
import { Theme, YStack } from 'tamagui';
import { ProductImage } from '../ProductImage';
import { ProductVariations } from '../product-variation/ProductVariations';
import { ContinueButton } from './ContinueButton';



export const ProductVariationsContent = () => {

    useRenderGuard("ProductVariationsContent");

    const { setModalType } = useModalContext();
    const { purchasable, setProductVariation } = usePurchasableContext();
    const variableProduct = purchasable.product as VariableProduct;

    const disabled = !purchasable.isValid;
    const handleContinue = () => {
        setModalType("quantity");
    };

    return (
        <Theme name="soft">
            <YStack f={1} h="100%" gap="$3">
                <ProductImage img_height={150} />
                <ThemedYStack f={1}>
                    <ProductVariations
                        key={variableProduct.id}
                        variableProduct={variableProduct}
                        onProductVariationSelected={setProductVariation} // Set the product variation here
                    />
                    <ContinueButton disabled={disabled} onPress={handleContinue} />
                </ThemedYStack>
            </YStack>
        </Theme>
    );
};
