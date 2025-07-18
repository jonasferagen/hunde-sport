import { ProductTile } from "@/components/ui/";
import { routes } from '@/config/routes';
import { Product } from "@/types";
import { Link } from 'expo-router';
import React from 'react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {

    return (
        <Link href={routes.product(product)} asChild>
            <ProductTile
                product={product}
                width={100}
                height={100}
                mainColor={'#777'}
            />
        </Link>
    );
};