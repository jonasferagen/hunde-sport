import { VariationChips } from '@/components/features/product/VariationChips';
import { Button, CustomText } from '@/components/ui';
import { useShoppingCart } from '@/contexts';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';

interface ProductHeaderProps {
    product: Product;
    displayProduct: Product;
    selectedOptions: Record<string, string>;
    onSelectOption: (attributeSlug: string, option: string) => void;
}


const AddProductToShoppingCartButton = ({ product, displayProduct }: { product: Product; displayProduct: Product }) => {
    const { addToCart, canAddToCart } = useShoppingCart();

    const isPurchasable = canAddToCart(displayProduct);

    return (
        <Button
            variant="primary"
            icon="addToCart"
            title={isPurchasable ? 'Legg til i handlekurv' : 'Velg variant'}
            onPress={() => addToCart(displayProduct)}
            disabled={!isPurchasable}
        />
    );
};

export const ProductMainSection = ({
    product,
    displayProduct,
    selectedOptions,
    onSelectOption,
}: ProductHeaderProps) => {


    return (
        <>
            <CustomText fontSize="xxl" bold>
                {formatPrice(displayProduct.price)}
            </CustomText>
            {product.attributes
                .filter(attr => attr.variation)
                .map(attribute => {
                    return (
                        <VariationChips
                            key={attribute.id}
                            options={attribute.options}
                            selectedOption={selectedOptions[attribute.slug] || null}
                            onSelectOption={option => onSelectOption(attribute.slug, option)}
                        />
                    );
                })}
            <CustomText fontSize="sm" >{product.short_description}</CustomText>
            <AddProductToShoppingCartButton product={product} displayProduct={displayProduct} />

        </>
    );
};
