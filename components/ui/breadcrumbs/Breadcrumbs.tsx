import { routes } from '@/config/routes';
import { Icon } from '../icon/Icon';
import { CustomText } from '../text/CustomText';

import { useBreadcrumbContext } from '@/contexts';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { SPACING } from '@/styles';
import { Category } from '@/types';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Loader } from '../loader/Loader';


interface BreadcrumbsProps {
    activeCategory: Category;
}

export const Breadcrumbs = React.memo(({ activeCategory }: BreadcrumbsProps) => {
    useRenderGuard('Breadcrumbs');
    const { categories, isLoading, setCategory } = useBreadcrumbContext();


    console.log("breadcrumbs rendered with categories", categories.map((category) => category.name));

    useEffect(() => {
        if (activeCategory) {
            setCategory(activeCategory);
        }
    }, [activeCategory, setCategory]);


    return (
        <View style={styles.container}>
            {isLoading || categories.length === 0 ? (
                <Loader size="small" />
            ) : (
                categories.length > 0 && (
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
});

export default Breadcrumbs;
