import { Button } from '@/components/ui';
import { useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import React from 'react';

interface BuyProductProps {
    product: Product;
}

export const BuyProduct = ({ product }: BuyProductProps) => {
    const { addToCart } = useShoppingCartContext();

    return (
        <Button
            variant="primary"
            icon="addToCart"
            title={'Legg til i handlekurv'}
            onPress={() => addToCart(product)}
        />
    );
};