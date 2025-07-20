import { Col, Row } from '@/components/ui/listitem/layout';
import { useProducts } from '@/hooks/Product';
import { Product } from '@/models/Product';
import React, { useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';
import { VariationChip } from './VariationChip';

interface ProductVariations {
    product: Product;
}

export const ProductVariations = ({
    product
}: ProductVariations) => {

    const { products: variantProducts, isLoading } = useProducts(product?.variations || []);

    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

    const variationAttributes = useMemo(() => product.getVariationAttributes(), [product]);

    useEffect(() => {
        // Only set initial options if we have variations and no options are selected yet
        if (variantProducts && variantProducts.length > 0 && Object.keys(selectedOptions).length === 0) {
            const initialOptions: Record<number, string> = {};
            const attributesToSelect =
                product.default_attributes?.length > 0
                    ? product.default_attributes
                    : variantProducts?.[0]?.attributes;

            if (attributesToSelect) {
                attributesToSelect.forEach((attr) => {
                    if (attr.option) {
                        initialOptions[attr.id] = attr.option;
                    }
                });
            }
            setSelectedOptions(initialOptions);
        }
    }, [product.default_attributes, variantProducts?.length, selectedOptions]);

    const handleSelectOption = (attributeId: number, optionName: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [attributeId]: optionName,
        }));
    };

    const availableOptions = useMemo(() => {
        if (!variantProducts) return new Map<number, Set<string>>();

        const available = new Map<number, Set<string>>();
        variationAttributes.forEach((attr) => {
            available.set(attr.id, new Set<string>());
        });

        for (const variant of variantProducts) {
            for (const variantAttr of variant.attributes) {
                let isMatch = true;
                // Check if this variant matches all *other* selected options
                for (const selectedAttrId in selectedOptions) {
                    if (Number(selectedAttrId) === variantAttr.id) continue; // Skip self

                    const selectedOption = selectedOptions[selectedAttrId];
                    const variantHasSelectedOption =
                        variant.attributes.find(
                            (a) => a.id === Number(selectedAttrId) && a.option === selectedOption
                        ) !== undefined;

                    if (!variantHasSelectedOption) {
                        isMatch = false;
                        break;
                    }
                }

                if (isMatch && variantAttr.option) {
                    available.get(variantAttr.id)?.add(variantAttr.option);
                }
            }
        }

        return available;
    }, [variantProducts, selectedOptions, variationAttributes]);

    return <>
        <Row>
            <Col>
                {variationAttributes.map(attribute => {
                    return (
                        <React.Fragment key={attribute.id}>
                            <Text style={{ marginTop: 8, marginBottom: 4 }}>{attribute.label}:</Text>
                            <Row style={{ flexWrap: 'wrap', marginBottom: 8 }}>
                                {attribute.options.map(option => (
                                    <VariationChip
                                        key={`${attribute.id}-${option.name}`}
                                        label={option.label}
                                        onPress={() => handleSelectOption(attribute.id, option.name)}
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

};
