import { Col, Row } from '@/components/ui/listitem/layout';
import { useProducts } from '@/hooks/Product';
import { Product } from '@/models/Product';
import React from 'react';
import { Text } from 'react-native';
import { VariationChip } from './VariationChip';

interface ProductVariations {
    product: Product;
}

export const ProductVariations = ({
    product
}: ProductVariations) => {

    const { products: variantProducts, isLoading } = useProducts(product?.variations || []);

    const options = product.getVariationAttributes();

    const availableOptions = new Set<string>();
    if (variantProducts) {
        variantProducts.forEach(variant => {
            variant.attributes.forEach(attr => {
                availableOptions.add(`${attr.id}-${attr.option}`);
            });
        });
    }

    const selectedOptions = new Set<string>();
    const attributesToSelect = product.default_attributes?.length > 0
        ? product.default_attributes
        : variantProducts?.[0]?.attributes;

    if (attributesToSelect) {
        attributesToSelect.forEach(attr => {
            selectedOptions.add(`${attr.id}-${attr.option}`);
        });
    }

    return <>
        <Row>
            <Col>
                {options.map(attribute => {
                    return (
                        <React.Fragment key={attribute.id}>
                            <Text style={{ marginTop: 8, marginBottom: 4 }}>{attribute.label}:</Text>
                            <Row style={{ flexWrap: 'wrap', marginBottom: 8 }}>
                                {attribute.options.map(option => (
                                    <VariationChip
                                        key={`${attribute.id}-${option.name}`}
                                        label={option.label}
                                        disabled={!availableOptions.has(`${attribute.id}-${option.name}`)}
                                        isSelected={selectedOptions.has(`${attribute.id}-${option.name}`)}
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
