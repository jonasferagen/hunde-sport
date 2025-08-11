import { ThemedXStack, ThemedYStack } from '@/components/ui';
import { useModalContext, useProductVariationContext } from "@/contexts";
import { VariableProduct } from "@/types";
import { Theme, YStack } from 'tamagui';
import { ProductImage } from '../ProductImage';
import { ProductPrice } from '../display/ProductPrice';
import { ProductVariationTitle } from '../product-variation/ProductVariationTitle';
import { ProductVariations } from '../product-variation/ProductVariations';
import { ContinueButton } from './ContinueButton';

interface ProductVariationsContentProps {
    product: VariableProduct;
}


export const ProductVariationsContent = ({ product }: ProductVariationsContentProps) => {

    const { productVariations, setSelectedProductVariation, purchasable } = useProductVariationContext();
    const { setModalType, setPurchasable } = useModalContext();
    const handleContinue = () => {
        setPurchasable(purchasable);
        setModalType("quantity");

    };


    return (
        <Theme name="soft">
            <YStack
                f={1}
                h="100%"
                gap="$3"
            >
                <ProductImage img_height={150} />
                <ThemedYStack f={1} >

                    {<ProductVariations
                        key={product.id}
                        product={product}
                        productVariations={productVariations || []}
                        onProductVariationSelected={setSelectedProductVariation}
                    />}
                </ThemedYStack>
                <ThemedYStack my="$3">
                    <ThemedXStack
                        ai="center"
                        jc="space-between"
                    >
                        <ProductVariationTitle fos="$6" /><ProductPrice fos="$6" />
                    </ThemedXStack>
                    <ContinueButton theme="normal" onPress={handleContinue} disabled={false} />
                </ThemedYStack>
            </YStack>
        </Theme>
    );
};

