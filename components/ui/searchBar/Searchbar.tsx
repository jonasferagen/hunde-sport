import { routes } from '@/config/routes';
import { useTheme } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import { Theme } from '@/types';
import { router } from 'expo-router';
import React, { forwardRef, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '../icon/Icon';

export interface SearchBarProps {
    placeholder?: string;
    initialQuery?: string;
    onQueryChange?: (query: string) => void;
    onSearch?: (query: string) => void;
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

    const handleSearch = () => {
        router.push(routes.search(query));
    };

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
                onSubmitEditing={handleSearch}
            />
            <Pressable onPress={handleSearch} style={styles.button} disabled={!query.trim()}>
                <Icon name="search" size='xl' color={theme.textOnColor.secondary} />
            </Pressable>
        </View>
    );
});

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.secondary,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        marginVertical: SPACING.md,
    },
    input: {
        flex: 1,
        height: 50,
        color: theme.colors.text,
        fontSize: 16,
    },
    button: {
        padding: SPACING.sm,
    },
});
