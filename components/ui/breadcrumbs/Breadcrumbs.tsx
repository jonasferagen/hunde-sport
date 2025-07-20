import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RecursiveBreadcrumb } from './RecursiveBreadcrumb';

interface BreadcrumbsProps {
    categoryId: number;
}

export const Breadcrumbs = React.memo(({ categoryId }: BreadcrumbsProps) => {
    return (
        <View style={styles.breadcrumbsContainer}>
            <RecursiveBreadcrumb categoryId={categoryId} isCurrent />
        </View>
    );
});

const styles = StyleSheet.create({
    breadcrumbsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
});


