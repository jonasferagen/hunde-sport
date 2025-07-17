import { routes } from '@/config/routes';
import { CustomText } from '../customtext/CustomText';
import { Icon } from '../icon/Icon';

import { useBreadcrumbs } from '@/contexts';
import { SPACING } from '@/styles';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Loader } from '../loader/Loader';

export const Breadcrumbs = React.memo(() => {

    const { categories, isLoading } = useBreadcrumbs();

    return (
        <View style={styles.container}>
            {isLoading ? (
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
