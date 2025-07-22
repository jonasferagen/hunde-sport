import { ListItem } from '@/components/ui/list/ListItem';
import { useThemeContext } from '@/contexts';
import { ProductProvider, useProductContext } from '@/contexts/ProductContext';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { Product } from '@/models/Product';
import React from 'react';
import { ItemActions } from './list/ItemActions';
import { ItemHeader } from './list/ItemHeader';

interface ProductListItemProps {
    product: Product;
    index: number;
    onPress: (id: number) => void;
    isExpanded: boolean;
    expandedHeight: number;
    categoryId?: number;
}

const ProductListItemContent: React.FC<Omit<ProductListItemProps, 'product'>> = ({
    onPress,
    isExpanded,
    categoryId,
}) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('default');

    const { getQuantity, increaseQuantity, decreaseQuantity, purchaseInfo } = useShoppingCartContext();
    const { product, productVariant } = useProductContext();

    const activeProduct = productVariant || product;

    if (!product || !activeProduct) {
        return null;
    }

    const { status } = purchaseInfo(activeProduct);
    const isPurchasable = status === 'ok';

    const quantity = getQuantity(activeProduct);

    const handleIncrease = () => {
        if (!isPurchasable) return;
        increaseQuantity(activeProduct, product);
    };

    const handleDecrease = () => {
        if (!isPurchasable) return;
        decreaseQuantity(activeProduct);
    };

    const handleExpand = () => {
        onPress(product.id);
    };

    return (
        <ListItem
            header={<ItemHeader product={product} activeProduct={activeProduct} categoryId={categoryId} />}
            actions={
                <ItemActions
                    product={product}
                    activeProduct={activeProduct}
                    isExpanded={isExpanded}
                    quantity={quantity}
                    handleExpand={handleExpand}
                    handleIncrease={handleIncrease}
                    handleDecrease={handleDecrease}
                />
            }
        />
    );
};


export const ProductListItem: React.FC<ProductListItemProps> = ({ product, ...props }) => {
    return (
        <ProductProvider product={product}>
            <ProductListItemContent {...props} />
        </ProductProvider>
    );
};
