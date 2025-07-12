import { COLORS } from '@/styles/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${query}`);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Søk etter produkter..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
            />
            <Pressable onPress={handleSearch} style={styles.button}>
                <Ionicons name="search" size={24} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 5,
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: 5,
    },
    button: {
        padding: 10,
        marginLeft: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        justifyContent: 'center',
    },
});
