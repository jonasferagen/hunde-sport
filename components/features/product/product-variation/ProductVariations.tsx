import { ThemedText } from '@/components/ui/themed-components/ThemedText';
import { useProductVariationSelector } from '@/models/Product/helpers/useProductVariationSelector';
import { Product, VariableProduct } from '@/models/Product/Product';
import { ProductVariation } from '@/types';
import { JSX } from 'react';
import { StackProps, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

interface ProductVariationsProps {
    product: Product;
    productVariations: ProductVariation[];
    onProductVariationSelected: (variation: ProductVariation | undefined) => void;
    stackProps?: StackProps;
}

export const ProductVariations = ({ product, productVariations, onProductVariationSelected, stackProps }: ProductVariationsProps): JSX.Element => {

    const { attributes, selectionManager, handleSelectOption, unavailableOptions } = useProductVariationSelector({
        product: product as VariableProduct,
        productVariations,
        onProductVariationSelected,
    });

    return (
        <XStack gap="$2" fg={1} fw="wrap" {...stackProps} >
            {attributes.map(({ id, name }) => {
                const options = selectionManager.getAvailableOptions(name);
                const filteredOptions = options.filter((option) => !unavailableOptions[name]?.includes(option.name));
                const selectedValue = selectionManager.getSelectedOption(name);
                if (filteredOptions.length === 0) return null;

                return (
                    <YStack key={id} gap="$1" f={1}>
                        <ThemedText tt="capitalize">{name}</ThemedText>
                        <AttributeSelector
                            options={filteredOptions}
                            selectedValue={selectedValue}
                            onSelect={(value) => handleSelectOption(name, value)}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
};