import { CustomText } from '../customtext/CustomText';
import { Icon } from '../icon/Icon';

import { useBreadcrumbs } from '@/hooks/Breadcrumbs/BreadcrumbProvider';
import { SPACING } from '@/styles';
import { Product } from '@/types';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface BreadcrumbsProps {
    product?: Product;
};

export const Breadcrumbs = ({ product }: BreadcrumbsProps) => {

    const { categories, navigateToCategory } = useBreadcrumbs();
    return (
        <View style={styles.container}>
            <View style={styles.categoryContainer}>
                {categories.map((category, index) => (
                    <React.Fragment key={category.id}>
                        <Pressable onPress={() => navigateToCategory(category)} style={styles.crumbContainer}>
                            <CustomText style={styles.crumbText}>{category.name}</CustomText>
                        </Pressable>
                        {(index < categories.length - 1) && (
                            <Icon name="breadcrumbSeparator" color={styles.crumbText.color} size={'sm'} style={styles.crumbSeparator} />
                        )}
                    </React.Fragment>
                ))}
            </View>
            {product && (
                <CustomText bold style={[styles.crumbText, styles.productText]}>{product.name}</CustomText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: SPACING.xs
    },
    crumbContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    crumbText: {
        color: 'black'
    },
    crumbSeparator: {
        marginHorizontal: SPACING.xs,
        top: 0,
    },
    productText: {
        marginTop: SPACING.sm,
    }
});

export default Breadcrumbs;
