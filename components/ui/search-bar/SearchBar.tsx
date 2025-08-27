// components/ui/search-bar/SearchBar.tsx
import React from "react";
import { TextInput as RNTextInput } from "react-native";
import { XStack } from "tamagui";

import { ThemedInput } from "../themed-components";

export interface SearchBarProps {
  placeholder?: string;
  /** Controlled value: if provided, component mirrors this */
  value?: string;
  /** Uncontrolled initial value: used only on first mount when value is undefined */
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  autoFocus?: boolean;
}

export const SearchBar = React.memo(function SearchBar({
  placeholder = "Hva leter du etter?",
  value,
  defaultValue = "",
  onChangeText,
  onSubmit,
  autoFocus,
}: SearchBarProps) {
  // Internal state only when NOT controlled
  const [inner, setInner] = React.useState(defaultValue);

  // Keep internal state in sync when switching to controlled mode or when value changes
  React.useEffect(() => {
    if (value !== undefined) setInner(value);
  }, [value]);

  const handleChange = React.useCallback(
    (text: string) => {
      if (value === undefined) setInner(text); // uncontrolled: update local state
      onChangeText?.(text); // always notify parent
    },
    [value, onChangeText]
  );

  const handleSubmit = React.useCallback(() => {
    const text = (value ?? inner).trim();
    if (value === undefined) setInner(text); // normalize uncontrolled text
    onSubmit?.(text);
  }, [value, inner, onSubmit]);

  return (
    <XStack ai="center" br="$4">
      <ThemedInput
        placeholder={placeholder}
        value={value ?? inner}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        autoFocus={autoFocus}
      />
    </XStack>
  );
});
