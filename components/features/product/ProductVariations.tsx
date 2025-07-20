import { Col, Row } from '@/components/ui/listitem/layout';
import { useProducts } from '@/hooks/Product';
import { Product } from '@/types';
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

    return <>
        <Row>
            <Col>
                {options.map(attribute => {
                    return (
                        <React.Fragment key={attribute.id}>
                            <Text style={{ marginTop: 8, marginBottom: 4 }}>{attribute.name}:</Text>
                            <Row style={{ flexWrap: 'wrap', marginBottom: 8 }}>
                                {attribute.options.map(option => (
                                    <VariationChip
                                        key={`${attribute.id}-${option.name}`}
                                        option={option.name}
                                        disabled={!availableOptions.has(`${attribute.id}-${option.name}`)}
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
