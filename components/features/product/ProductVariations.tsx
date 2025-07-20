import { Col, Row } from '@/components/ui/listitem/layout';
import { ProductAttribute } from '@/models/ProductAttribute';
import React, { JSX } from 'react';
import { Text } from 'react-native';
import { VariationChip } from './VariationChip';

interface ProductVariationsProps {
    variationAttributes: ProductAttribute[];
    selectedOptions: Record<number, string>;
    availableOptions: Map<number, Set<string>>;
    onOptionSelect: (attributeId: number, option: string) => void;
}

export const ProductVariations = ({ variationAttributes, selectedOptions, availableOptions, onOptionSelect }: ProductVariationsProps): JSX.Element | null => {
    if (variationAttributes.length === 0) {
        return null;
    }

    return (
        <Col>
            {variationAttributes.map((attribute) => (
                <React.Fragment key={attribute.id}>
                    <Text style={{ marginTop: 8, marginBottom: 4 }}>
                        {attribute.label}:
                    </Text>
                    <Row style={{ flexWrap: 'wrap', marginBottom: 8 }}>
                        {attribute.options.map((option) => {
                            if (option.name) {
                                return (
                                    <VariationChip
                                        key={`${attribute.id}-${option.name}`}
                                        label={option.label}
                                        onPress={() => onOptionSelect(attribute.id, option.name!)}
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
