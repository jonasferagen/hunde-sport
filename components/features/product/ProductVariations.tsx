import { Col, Row } from '@/components/ui/listitem/layout';
import { useProductVariations } from '@/hooks/useProductVariations';
import { Product } from '@/models/Product';
import React, { JSX, useEffect } from 'react';
import { Text } from 'react-native';
import { VariationChip } from './VariationChip';

interface ProductVariationsProps {
    product: Product;
    onVariantChange: (variant: Product | null) => void;
}

export const ProductVariations = ({ product, onVariantChange }: ProductVariationsProps): JSX.Element | null => {
    const {
        productVariant,
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes,
    } = useProductVariations(product);

    useEffect(() => {
        onVariantChange(productVariant);
    }, [productVariant, onVariantChange]);

    if (variationAttributes.length === 0) {
        return null;
    }

    return (
        <Col>
            {variationAttributes.map((attribute) => (
                <React.Fragment key={attribute.id}>
                    <Text style={{ marginTop: 8, marginBottom: 4, display: 'none' }}>
                        {attribute.label}:
                    </Text>
                    <Row style={{ flexWrap: 'wrap', marginBottom: 8 }}>
                        {attribute.options.map((option) => {
                            if (option.name) {
                                return (
                                    <VariationChip
                                        key={`${attribute.id}-${option.name}`}
                                        label={option.label}
                                        onPress={() => handleOptionSelect(attribute.id, option.name!)}
                                        disabled={!availableOptions.get(attribute.id)?.has(option.name)}
                                        isSelected={selectedOptions[attribute.id] === option.name}
                                    />
                                );
                            }
                            return null;
                        })}
                    </Row>
                </React.Fragment>
            ))}
        </Col>
    );
};
