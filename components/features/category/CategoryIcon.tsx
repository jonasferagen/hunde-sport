

import { Icon } from '@/components/ui';
import { Category } from '@/types';


import React, { useEffect, useState } from 'react';
import { SvgXml } from 'react-native-svg';

const ColoredSvg = ({ uri, size, color }: { uri: string; size: number; color: string }) => {
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
}

const TAG_ICON_NAME = 'tag';


export const CategoryIcon = ({ image, size, color }: CategoryIconProps) => {

    if (image?.src?.endsWith('.svg')) {
        return <ColoredSvg uri={image.src} size={size} color={color} />;
        //        return <SvgUri width={size} height={size} uri={image.src />;

    }

    return <Icon name={TAG_ICON_NAME} size={size} color={color} />
};
