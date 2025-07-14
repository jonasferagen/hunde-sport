import { Icon } from '@/components/ui';
import { Breadcrumb } from '@/types';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';
import { COLORS, FONT_SIZES, SPACING } from '@/styles';
import { lighten } from '@/utils/helpers';

export const Breadcrumbs = () => {

    const { breadcrumbs, handleNavigation } = useBreadcrumbs();

    const trail: Breadcrumb[] = [];

    return (
        <View style={styles.container}>
            {breadcrumbs.map((crumb, index) => {
                trail.push(crumb);
                const currentTrail = [...trail];
                return (
                    <View key={crumb.id ?? 'home'} style={styles.crumbContainer}>
                        <Pressable onPress={() => handleNavigation(currentTrail)}>
                            <Text style={styles.crumbText}>{crumb.name}</Text>
                        </Pressable>
                        {index < breadcrumbs.length - 1 && (
                            <Icon name="breadcrumbSeparator" color={styles.crumbText.color} size={FONT_SIZES.xs} style={styles.crumbSeparator} />
                        )}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: lighten(COLORS.primary, 10),
        borderBottomColor: COLORS.primary,
        shadowColor: COLORS.primary,
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
});

export default Breadcrumbs;
