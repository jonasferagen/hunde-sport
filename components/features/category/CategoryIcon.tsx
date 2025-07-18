

import { Icon } from '@/components/ui';
import { useThemeContext } from '@/contexts';
import { FONT_SIZES } from '@/styles';
import { Category } from '@/types';


import React, { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

const ColoredSvg = ({ uri, size, color, style }: { uri: string; size: string; color: string; style?: StyleProp<ViewStyle> }) => {
    const [xml, setXml] = useState<string | null>(null);

    const fontSize = FONT_SIZES[size as keyof typeof FONT_SIZES];

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

    return <SvgXml xml={xml} width={fontSize} height={fontSize} />;
};


interface CategoryIconProps {
    image: Category['image'];
    size?: string;
    color?: string;
    style?: StyleProp<ViewStyle>;
}

const TAG_ICON_NAME = 'tag';


export const CategoryIcon = ({ image, size = 'xl', color, style }: CategoryIconProps) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('primary');
    const finalColor = color || theme.text.primary;

    return <View style={style}>
        {
            (image?.src?.endsWith('.svg')) ?
                <ColoredSvg uri={image.src} size={size} color={finalColor} /> :
                <Icon name={TAG_ICON_NAME} size={size} color={finalColor} />
        }
    </View>;
};
