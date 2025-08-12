import { ThemedText } from '@/components/ui/themed-components/ThemedText';
import { ProductVariationProvider, useProductVariationContext, usePurchasableContext } from '@/contexts';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useProductVariationSelector } from '@/models/Product/helpers/useProductVariationSelector';
import { VariableProduct } from '@/models/Product/Product';
import { JSX } from 'react';
import { ScrollView, XStack, YStack, YStackProps } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';





interface ProductVariationSelectProps extends YStackProps { }


export const ProductVariationSelect = (props: ProductVariationSelectProps): JSX.Element => {
    const { purchasable } = usePurchasableContext();
    const variableProduct = purchasable.product as VariableProduct;

    return <ProductVariationProvider product={variableProduct}>
        <ProductVariationSelectContent {...props} />
    </ProductVariationProvider>

}

export const ProductVariationSelectContent = (props: ProductVariationSelectProps): JSX.Element => {

    useRenderGuard("ProductVariationSelect");

    const { purchasable, setProductVariation } = usePurchasableContext();
    const { productVariations } = useProductVariationContext();
    const variableProduct = purchasable.product as VariableProduct;

    const { attributes,
        selectionManager,
        handleSelectOption,
        unavailableOptions
    } = useProductVariationSelector({
        product: variableProduct,
        productVariations,
        onProductVariationSelected: setProductVariation,
    });

    return (
        <XStack gap="$2" fg={1} fw="wrap" {...props} bg={"$background"}>
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