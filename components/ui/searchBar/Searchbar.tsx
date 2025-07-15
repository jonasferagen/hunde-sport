import { routes } from '@/config/routing';
import { useTheme } from '@/hooks';
import { BORDER_RADIUS, SPACING } from '@/styles';
import { Theme } from '@/styles/Colors';
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
        if (query.trim()) {
            if (onSearch) {
                onSearch(query);
            } else {
                routes.search(query);
            }
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
            <Pressable onPress={handleSearch} style={styles.button}>
                <Icon name="search" size='xl' color={theme.textOnColor.secondary} />
            </Pressable>
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
