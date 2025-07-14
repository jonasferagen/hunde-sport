import { Icon } from '@/components/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';
import { COLORS, FONT_SIZES, SPACING } from '@/styles';

const Crumb = ({ crumb }: { crumb: any }) => {
    const { navigate } = useBreadcrumbs();

    if (crumb.type === 'product') {
        return <Text style={styles.productText}>{crumb.name}</Text>;
    }

    const isHome = crumb.type === 'home';

    return (
        <Pressable onPress={() => navigate(crumb)}>
            {isHome ? (
                <Icon name="home" size={FONT_SIZES.xxl} color={COLORS.textOnSecondary} />
            ) : (
                <Text style={styles.crumbText}>{crumb.name}</Text>
            )}
        </Pressable>
    );
};

export const Breadcrumbs = () => {

    const { breadcrumbs } = useBreadcrumbs();

    return (
        <View style={styles.container}>
            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.type + '-' + crumb.id}>
                    <View style={styles.crumbContainer}>
                        <Crumb crumb={crumb} />
                    </View>
                    {index < breadcrumbs.length - 1 && (
                        <Icon name="breadcrumbSeparator" color={styles.crumbText.color} size={FONT_SIZES.xs} style={styles.crumbSeparator} />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.secondary,
        borderBottomColor: COLORS.secondary,
        shadowColor: COLORS.secondary,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    crumbContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    crumbText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textOnSecondary,
    },
    crumbSeparator: {
        marginHorizontal: SPACING.xs,
        top: 1
    },
    productText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default Breadcrumbs;
