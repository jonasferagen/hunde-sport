import { Icon } from '@/components/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CategoryIcon } from '@/components/features/category';
import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';
import { FONT_SIZES, SPACING } from '@/styles';

export const Breadcrumbs = () => {

    const { categories, product, navigateToCategory } = useBreadcrumbs();

    return (
        <View style={styles.container}>
            {categories.map((category, index) => (
                <React.Fragment key={category.id}>
                    <Pressable onPress={() => navigateToCategory(category)} style={styles.crumbContainer}>
                        {category.parent >= 0 && <CategoryIcon image={category.image} size={FONT_SIZES.xl} color="black" style={{ marginRight: SPACING.sm }} />}
                        <Text style={styles.crumbText}>{category.name}</Text>
                    </Pressable>
                    {(index < categories.length - 1 || product) && (
                        <Icon name="breadcrumbSeparator" color={styles.crumbText.color} size={FONT_SIZES.sm} style={styles.crumbSeparator} />
                    )}
                </React.Fragment>
            ))}

            {product && (
                <View style={styles.crumbContainer}>
                    <Text style={styles.productText}>{product.name}</Text>
                </View>
            )}

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
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
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default Breadcrumbs;
