import { useBreadcrumbContext } from '@/contexts';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { SPACING } from '@/styles';
import { Category, Product } from '@/types';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Loader } from '../loader/Loader';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbsProps {
    category?: Category;
    product?: Product;
}

export const Breadcrumbs = React.memo(({ category, product }: BreadcrumbsProps) => {
    useRenderGuard('Breadcrumbs');
    const { categories, isLoading, setCategory, setProductFallback } = useBreadcrumbContext();

    useEffect(() => {
        if (category) {
            setCategory(category);
        } else if (product) {
            setProductFallback(product);
        }

    }, [category, setCategory]);

    //console.log("Breadcrumbs", categories.map(c => c.name).join(' > '));

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Loader size="small" />
            ) : (
                categories.length > 0 && (
                    <View style={styles.itemContainer}>
                        {categories.map((category, index) => (
                            <Breadcrumb
                                key={category.id}
                                category={category}
                                isLast={index === categories.length - 1}
                            />
                        ))}
                    </View>
                )
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        minHeight: SPACING.md, // Prevents layout shift during loading
        justifyContent: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: SPACING.xs
    },
    // Styles moved to Breadcrumb component
});

export default Breadcrumbs;
