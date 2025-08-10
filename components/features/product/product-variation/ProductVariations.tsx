import { useProductVariationSelector } from '@/models/Product/helpers/useProductVariationSelector';
import { Product, VariableProduct } from '@/models/Product/Product';
import { ProductVariation } from '@/types';
import { JSX } from 'react';
import { SizableText, StackProps, YStack } from 'tamagui';
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



    if (product.type !== "variable" || product.attributes.length === 0) {
        return <></>;
    }

    return (
        <YStack gap="$2" fw="wrap" {...stackProps}>
            {attributes.map(({ id, name }) => {
                const options = selectionManager.getAvailableOptions(name);
                const filteredOptions = options.filter((option) => !unavailableOptions[name]?.includes(option.name));
                const selectedValue = selectionManager.getSelectedOption(name);
                if (filteredOptions.length === 0) return null;

                return (
                    <YStack key={id} gap="$1" f={1} >
                        <SizableText size="$3" fow="bold" tt="capitalize">{name}</SizableText>
                        <AttributeSelector
                            options={filteredOptions}
                            selectedValue={selectedValue}
                            onSelect={(value) => handleSelectOption(name, value)}
                        />
                    </YStack>
                );
            })}
        </YStack>
    );
};