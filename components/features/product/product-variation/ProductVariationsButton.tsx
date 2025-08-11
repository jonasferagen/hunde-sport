import { Modal } from '@/components/ui/modal/Modal';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { ProductVariationProvider, useProductVariationContext } from '@/contexts/ProductVariationContext';
import { VariableProduct } from '@/models/Product/Product';
import { ScrollView, YStack } from 'tamagui';
import { PurchaseButton } from '../display/PurchaseButton';
import { ProductImage } from '../ProductImage';
import { ProductVariations } from './ProductVariations';
import { ProductVariationTitle } from './ProductVariationTitle';

import { ThemedXStack } from '@/components/ui';
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { THEME_VARIATION_BUTTON } from '@/config/app';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import { PawPrint } from '@tamagui/lucide-icons';
import React from 'react';
import { ProductPrice } from '../display/ProductPrice';


export const ProductVariationsButton = () => {
    const { product: variableProduct } = useBaseProductContext();
    const [open, setOpen] = React.useState(false);

    const product = variableProduct as VariableProduct;


    React.useEffect(() => {
        console.log('Modal Open State:', open);
    }, [open]);

    return (
        <>
            <CallToActionButton
                theme={THEME_VARIATION_BUTTON}
                iconAfter={<PawPrint />}
                onPress={() => {
                    setOpen(true);
                }}
            >
                Velg variant
            </CallToActionButton>

            <Modal open={open} onOpenChange={setOpen} title={product.name}>
                <ProductVariationProvider product={product}>
                    <ProductVariationsContent product={product} setOpen={setOpen} />
                </ProductVariationProvider>
            </Modal>

        </>
    );
};

interface ProductVariationsContentProps {
    product: VariableProduct;
    setOpen: (open: boolean) => void;
}

export const ProductVariationsContent = ({ product, setOpen }: ProductVariationsContentProps) => {
    const { isLoading, productVariations, setSelectedProductVariation } = useProductVariationContext();


    if (isLoading) return <LoadingScreen />

    return (
        <YStack f={1} h="100%" gap="$3" theme="active">
            <ProductImage img_height={150} />
            <ThemedXStack ai="center" jc="space-between">
                <ProductVariationTitle /><ProductPrice fos="$6" />
            </ThemedXStack>
            <ScrollView f={1} >
                {<ProductVariations
                    key={product.id}
                    product={product}
                    productVariations={productVariations || []}
                    onProductVariationSelected={setSelectedProductVariation}
                />}
            </ScrollView>
            <PurchaseButton f={0} mb="$3" onPurchase={() => setOpen(false)} />
        </YStack>

    );
};
