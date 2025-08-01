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
    const { liveQuery, setLiveQuery, setQuery } = useSearchContext();

    useEffect(() => {
        setLiveQuery(initialQuery);
    }, [initialQuery, setLiveQuery]);

    const handleSearch = () => {
        const trimmedQuery = liveQuery.trim();
        setQuery(trimmedQuery);
        onSubmit?.(trimmedQuery);
    };

    const handleChangeText = (text: string) => {
        setLiveQuery(text);
    };

    return (
        <XStack

            ai="center"
            backgroundColor="$white3"
            borderRadius="$4"
            paddingHorizontal="$3"
            borderWidth={1}
            borderColor="$borderColor"
        >
            <Input
                ref={ref}
                flex={1}
                fontSize="$3"
                placeholder={placeholder}
                placeholderTextColor="$color10"
                selectionColor="$color10"
                value={liveQuery}
                onChangeText={handleChangeText}
                onSubmitEditing={handleSearch}
                unstyled
                backgroundColor="transparent"
                borderColor="transparent"
            />
            <Button
                unstyled
                pressStyle={{ opacity: 0.7 }}
                onPress={handleSearch}
                disabled={!liveQuery.trim()}
                icon={<Search color="$color" />}
                padding="$2"
            />
        </XStack>
    );
});
