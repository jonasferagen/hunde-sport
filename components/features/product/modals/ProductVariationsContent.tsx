import { ThemedXStack } from '@/components/ui';
import { useProductVariationContext } from "@/contexts";
import { VariableProduct } from "@/types";
import { ScrollView, YStack } from 'tamagui';
import { ProductImage } from '../ProductImage';
import { ProductPrice } from '../display/ProductPrice';
import { PurchaseButton } from '../display/PurchaseButton';
import { ProductVariationTitle } from '../product-variation/ProductVariationTitle';
import { ProductVariations } from '../product-variation/ProductVariations';

interface ProductVariationsContentProps {
    product: VariableProduct;
    onPurchase: () => void;
}


export const ProductVariationsContent = ({ product, onPurchase }: ProductVariationsContentProps) => {

    const { productVariations, setSelectedProductVariation } = useProductVariationContext();

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
            <PurchaseButton f={0} mb="$3" onPurchase={onPurchase} />
        </YStack>

    );
};

