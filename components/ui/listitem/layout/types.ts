import React from 'react';
import { FlexAlignType, StyleProp, ViewStyle } from 'react-native';

export interface ContainerProps {
    children: React.ReactNode;
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: FlexAlignType;
    style?: StyleProp<ViewStyle>;
    debug?: string;
    onPress?: () => void;
}
