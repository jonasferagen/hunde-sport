import { Button, CustomText, Heading, Icon } from '@/components/ui';
import { Row } from '@/components/ui/layout';
import { useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { ProductVariations } from './variation/ProductVariations';

export const BuyProduct = ({ product, displayProduct }: { product: Product; displayProduct: Product }) => {
    const { addToCart } = useShoppingCartContext();

    const outofstock = displayProduct.stock_status === 'outofstock';
    const title = (displayProduct.id === product.id) ? product.name : product.name + ' ' + displayProduct.name;

    return <>
        <Row alignItems="center" justifyContent="space-between">
            <Heading title={title} size="md" />
            <CustomText fontSize="xxl" bold>
                {formatPrice(displayProduct.price)}
            </CustomText>
        </Row>

        {outofstock && (
            <Row alignItems="center">
                <Icon name="outofstock" size="md" color='red' />
                <CustomText fontSize="sm" bold color='red'>Ikke på lager</CustomText>
            </Row>
        )}
        <ProductVariations displayAs="chips" />
        <CustomText fontSize="sm">{product.short_description}</CustomText>
        <Button
            icon="addToCart"
            title={'Legg til i handlekurv'}
            onPress={() => addToCart(displayProduct)}
        />
    </>;
};