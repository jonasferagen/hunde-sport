import { routes } from '@/config/routes';
import { CustomText } from '../customtext/CustomText';
import { Icon } from '../icon/Icon';

import { useBreadcrumbs } from '@/contexts';
import { SPACING } from '@/styles';
import { Category, Product } from '@/types';
import { Link } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface BreadcrumbsProps {
    category?: Category;
    product?: Product;
};

export const Breadcrumbs = React.memo(({ category, product }: BreadcrumbsProps) => {

    const { categories, setBreadcrumb } = useBreadcrumbs();

    const categoryForTrail = useMemo(() => category || product?.categories?.[0], [category, product]);

    useEffect(() => {
        console.log('categoryForTrail: ' + categoryForTrail?.name);

        if (categoryForTrail) {
            setBreadcrumb(categoryForTrail);
        }
    }, [categoryForTrail, setBreadcrumb]);


    console.log("category: " + category?.name + ' ' + "breadcrumbs set: " + categories.map((category) => category.name))


    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                {categories.map((category, index) => (
                    <React.Fragment key={category.id}>
                        <Link
                            href={routes.category(category)}
                            asChild
                        >
                            <Pressable style={styles.crumbContainer}>
                                <CustomText style={styles.crumbText}>{category.name}</CustomText>
                            </Pressable>
                        </Link>
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
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    itemContainer: {
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
