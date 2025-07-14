import { routes } from '@/lib/routing';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/styles';
import { COLORS } from '@/styles/Colors';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '../Icon';

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
}

export const SearchBar = ({ placeholder = 'Hva leter du etter?', onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState('');

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
                style={styles.input}
                placeholder={placeholder}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
            />
            <Pressable onPress={handleSearch} style={styles.button}>
                <Icon name="search" size={FONT_SIZES.xl} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.lg,
    },
    input: {
        flex: 1,
        padding: SPACING.sm,
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: BORDER_RADIUS.lg,
    },
    button: {
        padding: SPACING.sm,
        marginLeft: SPACING.md,
        backgroundColor: COLORS.secondary,
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center',
    },
});
