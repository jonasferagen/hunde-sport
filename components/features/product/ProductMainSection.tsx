import { VariationChips } from '@/components/features/product/VariationChips';
import { Button, CustomText, Heading } from '@/components/ui';
import { useShoppingCartContext } from '@/contexts';
import { Product, ProductAttribute } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { View } from 'react-native';

interface ProductHeaderProps {
    product: Product;
    displayProduct: Product;
    selectedOptions: Record<string, string>;
    onSelectOption: (attributeSlug: string, option: string) => void;
    attributes: ProductAttribute[];
}


const AddToCartButton = ({ product, displayProduct }: { product: Product; displayProduct: Product }) => {
    const { addToCart } = useShoppingCartContext();


    return (
        <Button
            variant="primary"
            icon="addToCart"
            title={'Legg til i handlekurv'}
            onPress={() => addToCart(displayProduct)}

        />
    );
};

export const ProductMainSection = ({
    product,
    displayProduct,
    selectedOptions,
    onSelectOption,
    attributes
}: ProductHeaderProps) => {
    return <>
        {attributes
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
        <View style={{ alignItems: "center", justifyContent: "space-between" }}>

            <Heading title={displayProduct.name} size="md" />
            <CustomText fontSize="xxl" bold>
                {formatPrice(displayProduct.price)}
            </CustomText>
        </View>
        <CustomText fontSize="sm" >{product.short_description}</CustomText>
        <AddToCartButton product={product} displayProduct={displayProduct} />
    </>

};
