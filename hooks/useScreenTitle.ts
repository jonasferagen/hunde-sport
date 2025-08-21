import { useNavigation } from 'expo-router';
import React from 'react';

export const useScreenTitle = (title?: string | null): void => {
    const nav = useNavigation();
    React.useLayoutEffect(() => {
        if (typeof title === 'string' && title.length) {
            nav.setOptions({ title });
        }
    }, [nav, title]);
};
