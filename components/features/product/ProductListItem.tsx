import { useThemeContext } from '@/contexts';
import { ProductProvider, useProductContext } from '@/contexts/ProductContext';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { Product } from '@/models/Product';
import React from 'react';
import { YStack } from 'tamagui';
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

    const { items, addToCart, updateQuantity, purchaseInfo } = useShoppingCartContext();
    const { product, productVariant } = useProductContext();

    const activeProduct = productVariant || product;

    if (!product || !activeProduct) {
        return null;
    }

    const { status } = purchaseInfo(activeProduct);
    const isPurchasable = status === 'ok';

    const cartItem = items.find((item) => (item.selectedVariant || item.baseProduct).id === activeProduct.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleIncrease = () => {
        if (!isPurchasable) return;
        if (quantity === 0) {
            addToCart(product, productVariant ?? undefined);
        } else {
            updateQuantity(activeProduct.id, quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (!isPurchasable) return;
        updateQuantity(activeProduct.id, quantity - 1);
    };

    const handleExpand = () => {
        onPress(product.id);
    };

    return (
        <YStack borderBottomWidth={1} borderColor={theme.borderColor} gap="$2" padding="$3">
            <ItemHeader product={product} activeProduct={activeProduct} categoryId={categoryId} />
            <ItemActions
                product={product}
                activeProduct={activeProduct}
                isExpanded={isExpanded}
                quantity={quantity}
                handleExpand={handleExpand}
                handleIncrease={handleIncrease}
                handleDecrease={handleDecrease}
            />
        </YStack >
    );
};


export const ProductListItem: React.FC<ProductListItemProps> = ({ product, ...props }) => {
    return (
        <ProductProvider product={product}>
            <ProductListItemContent {...props} />
        </ProductProvider>
    );
};
