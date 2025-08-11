import { ThemedText } from '@/components/ui/themed-components/ThemedText';
import { useProductVariationContext } from '@/contexts';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useProductVariationSelector } from '@/models/Product/helpers/useProductVariationSelector';
import { VariableProduct } from '@/models/Product/Product';
import { ProductVariation } from '@/types';
import { JSX } from 'react';
import { ScrollView, StackProps, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

interface ProductVariationsProps {
    variableProduct: VariableProduct;
    onProductVariationSelected: (variation: ProductVariation | undefined) => void;
    stackProps?: StackProps;
}

export const ProductVariations = ({ variableProduct: variableProduct, onProductVariationSelected, stackProps }: ProductVariationsProps): JSX.Element => {

    useRenderGuard("ProductVariations");
    const { productVariations } = useProductVariationContext();


    const { attributes,
        selectionManager,
        handleSelectOption,
        unavailableOptions
    } = useProductVariationSelector({
        product: variableProduct,
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
                        <ThemedText tt="capitalize" fos="$5" fow="bold">{name}</ThemedText>
                        <ScrollView>

                            <AttributeSelector
                                options={filteredOptions}
                                selectedValue={selectedValue}
                                onSelect={(value) => handleSelectOption(name, value)}
                            />
                        </ScrollView>
                    </YStack>
                );
            })}
        </XStack>
    );
};