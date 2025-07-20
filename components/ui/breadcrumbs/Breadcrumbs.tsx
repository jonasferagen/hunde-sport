import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RecursiveBreadcrumb } from './RecursiveBreadcrumb';

interface BreadcrumbsProps {
    categoryId: number;
    isLastClickable?: boolean;
}

export const Breadcrumbs = React.memo(({ categoryId, isLastClickable = false }: BreadcrumbsProps) => {
    return (
        <View style={styles.breadcrumbsContainer}>
            <RecursiveBreadcrumb categoryId={categoryId} isLast={true} isLastClickable={isLastClickable} />
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
