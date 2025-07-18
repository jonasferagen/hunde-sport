import { VariationChips } from '@/components/features/product/VariationChips';
import { Button, CustomText, Heading } from '@/components/ui';
import { Row } from '@/components/ui/listitem/layout/Row';
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


const AddToCartButton = ({ product, displayProduct }: { product: Product; displayProduct: Product }) => {
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

    return <>

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
        <Row alignItems="center" justifyContent="space-between">

            <Heading title={displayProduct.name} size="md" />
            <CustomText fontSize="xxl" bold>
                {formatPrice(displayProduct.price)}
            </CustomText>
        </Row>
        <CustomText fontSize="sm" >{product.short_description}</CustomText>
        <AddToCartButton product={product} displayProduct={displayProduct} />
    </>

};
