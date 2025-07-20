import { Col, Row } from '@/components/ui/listitem/layout';
import { useProducts } from '@/hooks/Product';
import { Product } from '@/models/Product';
import React, { JSX, useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';
import { VariationChip } from './VariationChip';

interface ProductVariationsProps {
    product: Product;
    onVariationChange: (product: Product) => void;
}

export const ProductVariations = ({ product, onVariationChange }: ProductVariationsProps): JSX.Element | null => {
    const { products: variantProducts, isLoading } = useProducts(product.variations);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

    // Effect to set the initial default variation when the component mounts
    useEffect(() => {
        if (product.default_attributes.length > 0 && variantProducts && Object.keys(selectedOptions).length === 0) {
            const initialOptions: Record<number, string> = {};
            product.default_attributes.forEach(attr => {
                if (attr.id && attr.option) {
                    initialOptions[attr.id] = attr.option;
                }
            });
            setSelectedOptions(initialOptions);
        }
    }, [product.default_attributes, variantProducts, selectedOptions]);

    // Effect to notify the parent component when the selected variation changes
    useEffect(() => {
        if (!variantProducts) return;

        const matchedVariant = product.findVariant(variantProducts, selectedOptions);
        if (matchedVariant) {
            onVariationChange(matchedVariant);
        } else if (Object.keys(selectedOptions).length === 0) {
            // If no options are selected, signal that there is no specific variant.
            onVariationChange(null);
        }
    }, [selectedOptions, variantProducts, product, onVariationChange]);

    const handleOptionSelect = (attributeId: number, option: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [attributeId]: option,
        }));
    };

    const availableOptions = useMemo(() => {
        if (!variantProducts) return new Map();
        return product.getAvailableOptions(variantProducts, selectedOptions);
    }, [variantProducts, selectedOptions, product]);

    const variationAttributes = product.getVariationAttributes();

    if (!variantProducts || variationAttributes.length === 0) {
        return null; // Don't render anything for simple products
    }

    return (
        <>
            <Row>
                <Col>
                    {variationAttributes.map((attribute) => {
                        return (
                            <React.Fragment key={attribute.id}>
                                <Text style={{ marginTop: 8, marginBottom: 4 }}>
                                    {attribute.label}:
                                </Text>
                                <Row style={{ flexWrap: 'wrap', marginBottom: 8 }}>
                                    {attribute.options.map((option) => (
                                        <VariationChip
                                            key={`${attribute.id}-${option.name}`}
                                            label={option.label}
                                            onPress={() => handleOptionSelect(attribute.id, option.name)}
                                            disabled={!availableOptions.get(attribute.id)?.has(option.name)}
                                            isSelected={selectedOptions[attribute.id] === option.name}
                                        />
                                    ))}
                                </Row>
                            </React.Fragment>
                        );
                    })}
                </Col>
            </Row>
        </>
    );
};
