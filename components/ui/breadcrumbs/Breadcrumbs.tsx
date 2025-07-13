import { Breadcrumb } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { lighten } from '@/utils/helpers';

export const Breadcrumbs = () => {

    const { breadcrumbs, handleNavigation, setTrail } = useBreadcrumbs();

    const onNavigate = (trail: Breadcrumb[]) => {
        console.log(trail.length);
        setTrail(trail, true);
    };

    const trail: Breadcrumb[] = [];

    return (
        <View style={styles.container}>
            {breadcrumbs.map((crumb, index) => {
                trail.push(crumb);
                const currentTrail = [...trail];

                return (
                    <React.Fragment key={crumb.id ?? 'home'}>
                        <Pressable onPress={() => onNavigate(currentTrail)}>
                            <Text style={styles.crumbText}>{crumb.name}</Text>
                        </Pressable>
                        {index < breadcrumbs.length - 1 && (
                            <Ionicons name="chevron-forward" size={16} color="black" style={[styles.crumbText, styles.separator]} />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: lighten(COLORS.secondary, 10),
        borderBottomColor: COLORS.secondary,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    crumbText: {
        fontSize: 14,
        color: COLORS.textOnSecondary,
    },
    separator: {
        marginHorizontal: SPACING.xs,
    },
});

export default Breadcrumbs;
