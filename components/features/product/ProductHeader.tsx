import { VariationSelector } from '@/components/features/product/VariationSelector';
import { Button, CustomText } from '@/components/ui';
import { useShoppingCart } from '@/contexts';
import { SPACING } from '@/styles';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { View } from 'react-native';

interface ProductHeaderProps {
    product: Product;
    displayProduct: Product;
    selectedOptions: Record<string, string>;
    onSelectOption: (attributeSlug: string, option: string) => void;
}


const AddProductToShoppingCartButton = ({ product, displayProduct }: { product: Product; displayProduct: Product }) => {
    const { addToCart } = useShoppingCart();
    console.log("add to cart button loading", product.id, displayProduct.id)
    return (
        <Button
            variant="primary"
            icon="addToCart"
            title="Legg til i handlekurv"
            onPress={() => addToCart(displayProduct)}
        />
    );
};

export const ProductHeader = ({
    product,
    displayProduct,
    selectedOptions,
    onSelectOption,
}: ProductHeaderProps) => {


    return (
        <View style={{ gap: SPACING.md }}>
            <CustomText size="xxl" bold>
                {formatPrice(displayProduct.price)}
            </CustomText>
            {product.attributes
                .filter(attr => attr.variation)
                .map(attribute => {
                    return (
                        <VariationSelector
                            key={attribute.id}
                            attribute={attribute}
                            selectedOption={selectedOptions[attribute.slug] || null}
                            onSelectOption={option => onSelectOption(attribute.slug, option)}
                        />
                    );
                })}
            <CustomText size="sm">{product.short_description}</CustomText>
            <AddProductToShoppingCartButton product={product} displayProduct={displayProduct} />
        </View>
    );
};
