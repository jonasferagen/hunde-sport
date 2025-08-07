import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useProductContext } from '@/contexts';
import { useProductVariationSelector } from '@/models/Product/helpers/useProductVariationSelector';
import { VariableProduct } from '@/models/Product/Product';
import { ProductVariation } from '@/types';
import { JSX } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

interface VariationSelectorProps {
    product: VariableProduct;
    productVariations: ProductVariation[];
    onProductVariationSelected: (variation: ProductVariation | undefined) => void;
}

const VariationSelector = ({ product, productVariations, onProductVariationSelected: onVariationSelected }: VariationSelectorProps): JSX.Element => {
    const { attributes, selectionManager, handleSelectOption } = useProductVariationSelector({
        product,
        productVariations,
        onProductVariationSelected: onVariationSelected,
    });

    if (attributes.length === 0) {
        return <></>;
    }

    return (
        <XStack gap="$2" flexWrap="wrap">
            {attributes.map(({ id, name }) => {
                const options = selectionManager.getAvailableOptions(name);
                const selectedValue = selectionManager.getSelectedOption(name);
                if (options.length === 0) return null;

                return (
                    <YStack key={id} gap="$1" f={1}>
                        <SizableText size="$3" fow="bold" tt="capitalize">{name}</SizableText>
                        <AttributeSelector
                            options={options}
                            selectedValue={selectedValue}
                            onSelect={(value) => handleSelectOption(name, value)}
                        />
                    </YStack>
                );
            })}

        </XStack>
    );
};

export const ProductVariations = (): JSX.Element => {
    const { isLoading, product: initialProduct, setSelectedProductVariation, productVariations } = useProductContext();

    if (!(initialProduct instanceof VariableProduct)) {
        return <></>;
    }
    const product = initialProduct as VariableProduct;
    if (isLoading) {
        return <ThemedSpinner />;
    }

    return (
        <VariationSelector
            product={product}
            productVariations={productVariations || []}
            onProductVariationSelected={setSelectedProductVariation}
        />
    );
};