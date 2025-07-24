import { routes } from '@/config/routes';
import { useProductContext } from '@/contexts';
import { Link } from 'expo-router';
import React, { JSX } from 'react';
import { Button, SizableText } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { SimpleItemHeader } from './SimpleItemHeader';

interface ItemHeaderProps {
    categoryId?: number;
}

export const ItemHeader = ({ categoryId }: ItemHeaderProps): JSX.Element => {
    const { product } = useProductContext();


    if (!product) {
        return <></>;
    }

    return (
        <Link href={routes.product(product, categoryId)} asChild>
            <Button unstyled pressStyle={{ opacity: 0.7 }}>
                <SimpleItemHeader>
                    <PriceTag />
                    <SizableText fontSize="$1" color="$color" numberOfLines={2}>
                        {product.short_description}
                    </SizableText>
                </SimpleItemHeader>
            </Button>
        </Link>
    );
};
