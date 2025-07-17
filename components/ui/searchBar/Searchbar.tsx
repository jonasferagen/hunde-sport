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
    const { theme, _theme } = useTheme();

    const _themeVariant = _theme.default;
    const styles = createStyles(_themeVariant);

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
                value={query}
                onChangeText={(text) => {
                    setQuery(text);
                    onQueryChange?.(text);
                }}
                onSubmitEditing={handleSearch}
            />
            <Pressable onPress={handleSearch} style={styles.button} disabled={!query.trim()}>
                <Icon name="search" size='xl' color={_themeVariant.color} />
            </Pressable>
        </View>
    );
});

const createStyles = (_themeVariant: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: _themeVariant.backgroundColor,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        marginVertical: SPACING.md,
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZES.md,
    },
    button: {
        padding: SPACING.sm,
    },
});
