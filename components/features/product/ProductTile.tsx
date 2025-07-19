import type { Product } from '@/types';
import { formatPrice } from "@/utils/helpers";
import { BaseTile, BaseTileProps } from '../../ui/tile/BaseTile';

interface ProductTileProps extends Omit<BaseTileProps, 'name' | 'imageUrl' | 'topRightText'> {
    product: Product;
}

export const ProductTile = ({ product, ...rest }: ProductTileProps) => {
    const { images, name, price } = product;
    const image = images[0];

    return (
        <BaseTile
            name={name}
            imageUrl={image.src}
            topRightText={formatPrice(price)}
            nameNumberOfLines={2}
            gradientMinHeight={40}
            {...rest}
        />
    );
}
