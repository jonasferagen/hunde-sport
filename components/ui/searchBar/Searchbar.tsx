import { useDebounce } from '@/hooks/useDebounce';
import { Search } from '@tamagui/lucide-icons';
import React, { forwardRef, useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { Button, Input, XStack } from 'tamagui';

export interface SearchBarProps {
    placeholder?: string;
    initialQuery?: string;
    onTextChange?: (query: string) => void;
    onQueryChange?: (query: string) => void;
    onSubmit?: (query: string) => void;
    debounce?: number;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(
    ({ placeholder = 'Hva leter du etter?', initialQuery, onTextChange, onQueryChange, onSubmit, debounce = 0 }, ref) => {
        const [query, setQuery] = useState(initialQuery || '');
        const debouncedQuery = useDebounce(query, debounce);

        useEffect(() => {
            if (initialQuery !== undefined) {
                setQuery(initialQuery);
            }
        }, [initialQuery]);

        useEffect(() => {
            if (debounce > 0) {
                onQueryChange?.(debouncedQuery);
            }
        }, [debouncedQuery]);

        const handleSearch = () => {
            onSubmit?.(query);
        };

        const handleChangeText = (text: string) => {
            setQuery(text);
            onTextChange?.(text);
            if (debounce === 0) {
                onQueryChange?.(text);
            }
        };

        return (
            <XStack
                alignItems="center"
                backgroundColor="$background"
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
                    value={query}
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
                    disabled={!query.trim()}
                    icon={<Search color="$color" />}
                    padding="$2"
                />
            </XStack>
        );
    }
);
