import { useSearchContext } from '@/contexts/SearchContext';
import React, { useEffect } from 'react';
import { XStack } from 'tamagui';
import { ThemedInput } from '../themed-components';

export interface SearchBarProps {
    placeholder?: string;
    initialQuery?: string;
    onSubmit?: (query: string) => void;
}

export const SearchBar = ({
    placeholder = 'Hva leter du etter?',
    initialQuery = '',
    onSubmit }: SearchBarProps) => {

    const { query, setQuery } = useSearchContext();

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery, setQuery]);


    return (
        <XStack
            ai="center"
            br="$4"
            px="$3"
        >
            <ThemedInput
                theme="light"
                placeholder={placeholder}
                value={query}
                onChangeText={(text: string) => {
                    setQuery(text);
                }}
                onSubmitEditing={() => {
                    const trimmedQuery = query.trim();
                    setQuery(trimmedQuery);
                    onSubmit?.(trimmedQuery);
                }}
            />
        </XStack>
    );
};


