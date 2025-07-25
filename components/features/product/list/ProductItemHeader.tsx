import { routes } from '@/config/routes';
import { useProductContext } from '@/contexts';
import { Link } from 'expo-router';
import React, { JSX } from 'react';
import { Button, SizableText, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';
import { SimpleProductItemHeader } from './SimpleProductItemHeader';

interface ProductItemHeaderProps {
    categoryId?: number;
}

export const ProductItemHeader = ({ categoryId }: ProductItemHeaderProps): JSX.Element => {
    const { product } = useProductContext();


    if (!product) {
        return <></>;
    }

    return (
        <YStack padding="$3">
            <Link href={routes.product(product, categoryId)} asChild>
                <Button unstyled pressStyle={{ opacity: 0.7 }}>
                    <SimpleProductItemHeader>
                        <XStack ai="center" gap="$2">
                            <PriceTag /><ProductStatus />
                        </XStack>
                        <SizableText fontSize="$1" color="$color" numberOfLines={2}>
                            {product.short_description}
                        </SizableText>
                    </SimpleProductItemHeader>
                </Button>
            </Link>
        </YStack>
    );
};
