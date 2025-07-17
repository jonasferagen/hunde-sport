import { routes } from '@/config/routes';
import { useTheme } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import { Theme } from '@/types';
import { router } from 'expo-router';
import React, { forwardRef, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export interface SearchBarProps {
    placeholder?: string;
    initialQuery?: string;
    onQueryChange?: (query: string) => void;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(({ placeholder = 'Hva leter du etter?', initialQuery, onQueryChange }, ref) => {
    const [query, setQuery] = useState(initialQuery || '');
    const { theme } = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        if (initialQuery !== undefined) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (query !== initialQuery) {
                router.push(routes.search(query));
            }
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [query, initialQuery, router]);

    return (
        <View style={styles.container}>
            <TextInput
                ref={ref}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                value={query}
                onChangeText={(text) => {
                    setQuery(text);
                    onQueryChange?.(text);
                }}
            />
        </View>
    );
});

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.lg,
    },
    input: {
        flex: 1,
        padding: SPACING.sm,
        backgroundColor: theme.colors.card,
        borderRadius: BORDER_RADIUS.lg,
        color: theme.colors.text,
    },
});
