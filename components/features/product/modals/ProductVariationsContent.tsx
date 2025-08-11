import { ThemedXStack } from '@/components/ui';
import { useModalContext, useProductVariationContext } from "@/contexts";
import { VariableProduct } from "@/types";
import { ScrollView, YStack } from 'tamagui';
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
        setModalType("quantity"); // same product still in context

    };


    return (
        <YStack f={1}
            h="100%"
            gap="$3"
            theme="active"
        >
            <ProductImage img_height={150} />
            <ThemedXStack
                ai="center"
                jc="space-between"
            >
                <ProductVariationTitle /><ProductPrice fos="$6" />
            </ThemedXStack>
            <ScrollView f={1}
                minHeight={0}
            >
                {<ProductVariations
                    key={product.id}
                    product={product}
                    productVariations={productVariations || []}
                    onProductVariationSelected={setSelectedProductVariation}
                />}
            </ScrollView>
            <ContinueButton onPress={handleContinue} disabled={false} />
        </YStack>

    );
};

