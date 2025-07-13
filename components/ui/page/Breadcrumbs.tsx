import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Crumb } from '@/hooks/BreadCrumb/BreadcrumbProvider';
import { SPACING } from '@/styles/Dimensions';

interface BreadcrumbsProps {
    trail: Crumb[];
    onNavigate: (crumb: Crumb) => void;
}

const Breadcrumbs = ({ trail, onNavigate }: BreadcrumbsProps) => {
    return (
        <View style={styles.container}>
            {trail.map((crumb, index) => (
                <React.Fragment key={crumb.id}>
                    <Pressable onPress={() => onNavigate(crumb)}>
                        <Text style={styles.crumbText}>{crumb.name}</Text>
                    </Pressable>
                    {index < trail.length - 1 && (
                        <Ionicons name="chevron-forward" size={16} color="black" style={styles.separator} />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    crumbText: {
        fontSize: 14,
    },
    separator: {
        marginHorizontal: SPACING.xs,
    },
});

export default Breadcrumbs;
