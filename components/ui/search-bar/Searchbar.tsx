import { useSearchContext } from '@/contexts/SearchContext';
import { Search } from '@tamagui/lucide-icons';
import React, { forwardRef, useEffect } from 'react';
import { Input, XStack } from 'tamagui';
import { ThemedButton } from '../themed-components';

export interface SearchBarProps {
    placeholder?: string;
    initialQuery?: string;
    onSubmit?: (query: string) => void;
}

export const SearchBar = forwardRef<Input, SearchBarProps>((
    { placeholder = 'Hva leter du etter?', initialQuery = '', onSubmit }, ref) => {
    const { query, setQuery } = useSearchContext();

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery, setQuery]);

    const handleSearch = () => {
        const trimmedQuery = query.trim();
        setQuery(trimmedQuery);
        onSubmit?.(trimmedQuery);
    };

    const handleChangeText = (text: string) => {
        setQuery(text);
    };

    return (
        <XStack
            ai="center"
            br="$4"
            px="$3"
            bw={1}
        >
            <Input
                f={1}
                ref={ref}
                placeholder={placeholder}
                value={query}
                onChangeText={handleChangeText}
                onSubmitEditing={handleSearch}

            />
            <ThemedButton
                onPress={handleSearch}
                disabled={!query.trim()}
            >
                <Search />
            </ThemedButton>
        </XStack>
    );
});
