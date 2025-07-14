

import { Icon } from '@/components/ui';
import { Category } from '@/types';


import React, { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

const ColoredSvg = ({ uri, size, color, style }: { uri: string; size: number; color: string; style?: StyleProp<ViewStyle> }) => {
    const [xml, setXml] = useState<string | null>(null);

    useEffect(() => {
        const loadSvg = async () => {
            const res = await fetch(uri);
            let text = await res.text();

            // Inject fill if it's not present
            if (!text.includes('fill=')) {
                text = text.replace(
                    /<path /g,
                    `<path fill="${color}" `
                );
            }

            setXml(text);
        };

        loadSvg();
    }, [uri, color]);

    if (!xml) return null;

    return <SvgXml xml={xml} width={size} height={size} />;
};


interface CategoryIconProps {
    image: Category['image'];
    size: number;
    color: string;
    style?: StyleProp<ViewStyle>;
}

const TAG_ICON_NAME = 'tag';


export const CategoryIcon = ({ image, size, color, style }: CategoryIconProps) => {

    return <View style={style}>
        {
            (image?.src?.endsWith('.svg')) ?
                <ColoredSvg uri={image.src} size={size} color={color} /> :
                <Icon name={TAG_ICON_NAME} size={size} color={color} />
        }
    </View>;
};
