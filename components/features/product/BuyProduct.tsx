import { Button, CustomText, Heading } from '@/components/ui';
import { Row } from '@/components/ui/layout';
import { useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { View } from 'react-native';
import { ProductVariations } from './variation/ProductVariations';

export const BuyProduct = ({ product, displayProduct }: { product: Product; displayProduct: Product }) => {
    const { addToCart } = useShoppingCartContext();


    return (
        <View>
            <Row alignItems="center" justifyContent="space-between">
                <Heading title={product.name + ' ' + displayProduct.name} size="md" />
                <CustomText fontSize="xxl" bold>
                    {formatPrice(displayProduct.price)}
                </CustomText>
            </Row>
            <ProductVariations displayAs="chips" />
            <CustomText fontSize="sm">{product.short_description}</CustomText>
            <Button
                variant="primary"
                icon="addToCart"
                title={'Legg til i handlekurv'}
                onPress={() => addToCart(displayProduct)}
            />
        </View>
    );
};