import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export const Preloader = () => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.8,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ),
        ]).start();
    }, [opacityAnim, scaleAnim]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('@/assets/images/splash-icon.png')}
                style={[
                    styles.image,
                    {
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            />
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        fontFamily: 'Montserrat_400Regular',
    },
});


