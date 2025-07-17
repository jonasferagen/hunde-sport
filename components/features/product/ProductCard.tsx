import { ProductTile } from "@/components/ui/";
import { _routes } from '@/config/routes';
import { Product } from "@/types";
import { Link } from 'expo-router';
import React from 'react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {

    return (
        <Link href={_routes.product(product)} asChild>
            <ProductTile
                product={product}
                width={200}
                height={150}
                mainColor={'#777'}
            />
        </Link>
    );
};