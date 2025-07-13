import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from './Icon';

interface IconBadgeProps {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    size: number;
    color: string;
    count: number;
}

const IconBadge = ({ name, size, color, count }: IconBadgeProps) => {
    return (
        <View>
            <Icon name={name} size={size} color={color} />
            {count > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{count}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        right: -10,
        top: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default IconBadge;
