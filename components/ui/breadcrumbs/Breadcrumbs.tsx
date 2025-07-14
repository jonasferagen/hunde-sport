import { CategoryIcon } from '@/components/features/category';
import { Icon } from '@/components/ui';
import { useBreadcrumbs } from '@/contexts/BreadcrumbContext';
import { FONT_SIZES, SPACING } from '@/styles';
import { Product } from '@/types';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


interface BreadcrumbsProps {
    product?: Product;
};

export const Breadcrumbs = ({ product }: BreadcrumbsProps) => {

    const { categories, navigateToCategory } = useBreadcrumbs();
    return (
        <View style={styles.container}>
            {categories.map((category, index) => (
                <React.Fragment key={category.id}>
                    <Pressable onPress={() => navigateToCategory(category)} style={styles.crumbContainer}>
                        {category.parent >= 0 && <CategoryIcon image={category.image} size={FONT_SIZES.xl} color="black" style={{ marginRight: SPACING.sm }} />}
                        <Text style={styles.crumbText}>{category.name}</Text>
                    </Pressable>
                    {(index < categories.length - 1) && (
                        <Icon name="breadcrumbSeparator" color={styles.crumbText.color} size={FONT_SIZES.sm} style={styles.crumbSeparator} />
                    )}
                </React.Fragment>
            ))}
            {product && (
                <React.Fragment>
                    <Icon name="breadcrumbSeparator" size={FONT_SIZES.sm} style={styles.crumbSeparator} />
                    <Text style={[styles.crumbText, styles.productText]}>{product.name}</Text>
                </React.Fragment>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: SPACING.sm
    },
    crumbContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    crumbText: {
        fontSize: FONT_SIZES.md,
        color: 'black'
    },
    crumbSeparator: {
        marginHorizontal: SPACING.sm,
        top: 1
    },
    productText: {
        fontWeight: 'bold',
        fontSize: FONT_SIZES.lg,
    }
});

export default Breadcrumbs;
