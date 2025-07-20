import { Col, Row } from '@/components/ui/layout';
import { Select } from '@/components/ui/select/Select';
import { useProductVariations } from '@/hooks/useProductVariations';
import { Product } from '@/models/Product';
import { formatPrice } from '@/utils/helpers';
import React, { JSX, useEffect } from 'react';
import { Text } from 'react-native';
import { VariationChip } from './VariationChip';

interface ProductVariationsProps {
    product: Product;
    onVariantChange: (variant: Product | null) => void;
    displayAs?: 'chips' | 'select';
}

export const ProductVariations = ({
    product,
    onVariantChange,
    displayAs = 'select',
}: ProductVariationsProps): JSX.Element | null => {
    const {
        productVariant,
        productVariations,
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes,
    } = useProductVariations(product);

    useEffect(() => {
        onVariantChange(productVariant);
    }, [productVariant, onVariantChange]);

    if (!variationAttributes || variationAttributes.length === 0) {
        return null;
    }

    const getStockDisplay = (status: string) => {
        switch (status) {
            case 'instock':
                return 'In Stock';
            case 'outofstock':
                return 'Out of Stock';
            default:
                return '';
        }
    };

    return (
        <Col>
            {variationAttributes.map((attribute) => {
                const currentSelection = selectedOptions[attribute.id];
                const options = attribute.options.filter((o) => o.name);

                return (
                    <React.Fragment key={attribute.id}>
                        <Text style={{ marginTop: 8, marginBottom: 4 }}>{attribute.label}:</Text>
                        {displayAs === 'chips' ? (
                            <Row style={{ flexWrap: 'wrap', marginBottom: 8 }}>
                                {options.map((option) => (
                                    <VariationChip
                                        key={`${attribute.id}-${option.name}`}
                                        label={option.label}
                                        onPress={() => handleOptionSelect(attribute.id, option.name!)}
                                        disabled={!availableOptions.get(attribute.id)?.has(option.name!)}
                                        isSelected={currentSelection === option.name}
                                    />
                                ))}
                            </Row>
                        ) : (
                            <Select
                                label=""
                                selectedValue={currentSelection}
                                onValueChange={(value) => handleOptionSelect(attribute.id, value as string)}
                                options={options.map((opt) => {
                                    const variationForOption = availableOptions.get(attribute.id)?.get(opt.name!);

                                    let label = opt.label;
                                    if (variationForOption) {
                                        const stockDisplay = getStockDisplay(variationForOption.stock_status);
                                        label += ` (${formatPrice(variationForOption.price)}, ${stockDisplay})`;
                                    } else {
                                        label += ' (Not available)';
                                    }

                                    return {
                                        label,
                                        value: opt.name!,
                                    };
                                })}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </Col>
    );
};
