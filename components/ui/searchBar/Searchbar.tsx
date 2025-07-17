import { _routes } from '@/config/routes';
import { useTheme } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import { Theme } from '@/types';
import { Link } from 'expo-router';
import React, { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '../icon/Icon';

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(({ placeholder = 'Hva leter du etter?', onSearch }, ref) => {
    const [query, setQuery] = useState('');
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const handleSearch = () => {
        if (query.trim() && onSearch) {
            onSearch(query);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                ref={ref}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
            />
            {onSearch ? (
                <Pressable onPress={handleSearch} style={styles.button}>
                    <Icon name="search" size='xl' color={theme.textOnColor.secondary} />
                </Pressable>
            ) : (
                <Link href={_routes.search(query)} asChild disabled={!query.trim()}>
                    <Pressable style={styles.button}>
                        <Icon name="search" size='xl' color={theme.textOnColor.secondary} />
                    </Pressable>
                </Link>
            )}
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
    button: {
        padding: SPACING.sm,
        marginLeft: SPACING.md,
        backgroundColor: theme.colors.secondary,
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center',
    },
});
