import { ThemedYStack } from '@/components/ui';
import { DefaultTextContent } from '@/components/ui/DefaultTextContent';
import { useCartStore } from '@/stores/cartStore';
import { FlashList } from '@shopify/flash-list';
import React, { JSX } from 'react';
import { CartListItem } from './CartListItem';



export const CartList = React.memo((): JSX.Element => {

    const items = useCartStore(s => s.cart?.items ?? []);
    if (!items.length) {
        return <DefaultTextContent>Handlekurven er tom</DefaultTextContent>
    }

    return (
        <ThemedYStack f={1} mih={0}>
            <FlashList
                data={items}
                keyExtractor={(i) => i.key}
                renderItem={({ item, index }) => <CartListItem item={item} index={index} />}
                estimatedItemSize={160}               // reasonable guess
                contentContainerStyle={{ paddingBottom: 20 }}
                removeClippedSubviews
            />
        </ThemedYStack>
    );
}
);
