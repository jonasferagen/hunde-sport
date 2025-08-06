import { useSearchContext } from '@/contexts/SearchContext';
import { Search } from '@tamagui/lucide-icons';
import React, { forwardRef, useEffect } from 'react';
import { Button, Input, XStack } from 'tamagui';

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
            bg="$white3"
            br="$4"
            px="$3"
            bw={1}
            boc="$borderColor"
        >
            <Input
                f={1}
                ref={ref}
                fos="$3"
                placeholder={placeholder}
                placeholderTextColor="$color10"
                selectionColor="$color10"
                value={query}
                onChangeText={handleChangeText}
                onSubmitEditing={handleSearch}
                unstyled
                bg="transparent"
                boc="transparent"
            />
            <Button
                unstyled
                pressStyle={{ opacity: 0.7 }}
                onPress={handleSearch}
                disabled={!query.trim()}
                scaleIcon={1.25}
                icon={<Search />}
                py="$2"
            />
        </XStack>
    );
});
