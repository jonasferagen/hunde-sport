import { useTheme } from '@/contexts';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/styles';
import React, { forwardRef, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '../icon/Icon';

export interface SearchBarProps {
    placeholder?: string;
    initialQuery?: string;
    onQueryChange?: (query: string) => void;
    onSubmit?: (query: string) => void;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(({ placeholder = 'Hva leter du etter?', initialQuery, onQueryChange, onSubmit }, ref) => {
    const [query, setQuery] = useState(initialQuery || '');
    const { theme, themeManager } = useTheme();

    const themeVariant = themeManager.getVariant('default');
    const styles = createStyles(themeVariant);

    useEffect(() => {
        if (initialQuery !== undefined) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    const handleSearch = () => {
        onSubmit?.(query);
    };

    return (
        <View style={styles.container}>
            <TextInput
                ref={ref}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                selectionColor={theme.colors.textSecondary}
                value={query}
                onChangeText={(text) => {
                    setQuery(text);
                    onQueryChange?.(text);
                }}
                onSubmitEditing={handleSearch}
            />
            <Pressable onPress={handleSearch} style={styles.button} disabled={!query.trim()}>
                <Icon name="search" size='xl' color={themeVariant.color} />
            </Pressable>
        </View>
    );
});

const createStyles = (themeVariant: { backgroundColor: string; color: string; borderColor: string; }) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeVariant.backgroundColor,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.sm,
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZES.md,
    },
    button: {
        padding: SPACING.sm,
    },
});
