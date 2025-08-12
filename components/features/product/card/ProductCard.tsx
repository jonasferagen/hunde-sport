import { routes } from '@/config/routes';
import { useProductCategoryContext } from '@/contexts';

import { ThemedXStack, ThemedYStack } from '@/components/ui/themed-components/ThemedStack';
import { usePurchasableContext } from '@/contexts/PurchasableContext';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { Button, StackProps, XStack } from 'tamagui';

import { ThemedLinearGradient } from '@/components/ui';
import { ThemedImage } from '@/components/ui/themed-components/ThemedImage';
import { getScaledImageUrl } from '@/lib/helpers';
import { YStack } from 'tamagui';
import { ProductDescription } from '../display/ProductDescription';
import { ProductTitle } from '../display/ProductTitle';
import { PurchaseButton } from '../display/PurchaseButton';

import { RenderArgs, RenderFn, useModalStore } from '@/stores/modalStore';
import { Purchasable } from '@/types';
import { ProductVariationsModal } from '../modals/ProductVariationsModal';
import { QuantitySelectModal } from '../modals/QuantitySelectModal';


export const PRODUCT_CARD_NARROW_COLUMN_WIDTH = 80;

export const ProductCard = React.memo(({ ...props }: StackProps) => {

    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    const { productCategory: category } = useProductCategoryContext();

    const href: HrefObject = routes.product.path(product, category?.id);
    return (
        <ThemedYStack p="$3" gap="$3" {...props} bbw={1} f={1}>
            <ThemedLinearGradient />
            <Link href={href} asChild>
                <Button unstyled pressStyle={{ opacity: 0.7 }}>
                    <ThemedXStack>
                        <ProductCardImage />
                        <ProductCardDescription />
                    </ThemedXStack>
                </Button>
            </Link>
            <ProductCardFooter />
        </ThemedYStack>
    );
});

export const ProductCardImage = ({ ...props }: StackProps) => {
    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    const imageSize = PRODUCT_CARD_NARROW_COLUMN_WIDTH;
    const uri = getScaledImageUrl(product.featuredImage.src, imageSize, imageSize);

    return (
        <YStack
            w={imageSize}
            h={imageSize}
            bw={1}
            boc="$borderColor"
            br="$3"
            ov="hidden"
            {...props}
        >
            <ThemedImage
                source={{ uri }}
                image={product.featuredImage}
                title={product.name}
                w={imageSize}
                h={imageSize}
            />
        </YStack>
    );
};

const ProductCardDescription = ({ ...stackProps }: StackProps) => {
    return (
        <ThemedYStack f={1} jc="flex-start" gap="$2" {...stackProps}>
            <XStack
                gap="$2"
                ai="flex-start"
                jc="space-between"
            >
                <ProductTitle fs={1} />

            </XStack>
            <ProductDescription
                numberOfLines={2}
                short={true}
                fow="normal"
            />
        </ThemedYStack>
    );
};

export const ProductCardFooter = () => {


    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    const isVariable = product.type === 'variable'; // safer than instanceof across realms
    const openModal = useModalStore((s) => s.openModal) as <P>(render: RenderFn<P>, payload?: P) => void;

    return (
        <PurchaseButton
            onPress={() =>
                openModal(({ close, replace, payload }: RenderArgs<Purchasable>) =>
                    isVariable
                        ? <VariationsStep close={close} replace={replace} payload={payload} />
                        : <QuantityStep close={close} replace={replace} payload={payload} />
                    , purchasable)
            }
        />
    );
}



type StepProps = RenderArgs<Purchasable>;

const VariationsStep: React.FC<StepProps> = ({ payload, replace, close }) => {
    // hooks go here if needed
    return (
        <ProductVariationsModal
            purchasable={payload}
            onSelect={(selectedVariation) => {
                // build next payload
                const nextPayload = { ...payload, selectedVariation };
                // IMPORTANT: pass a FUNCTION, not an element
                replace(({ close: close2 }) => (
                    <QuantitySelectModal purchasable={nextPayload} onSelect={close2} />
                ), nextPayload);
            }}
        />
    );
};

const QuantityStep: React.FC<StepProps> = ({ payload, close }) => {
    // hooks go here if needed
    return <QuantitySelectModal purchasable={payload} onSelect={close} />;
};
