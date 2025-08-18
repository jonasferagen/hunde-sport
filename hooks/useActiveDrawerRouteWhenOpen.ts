// useActiveDrawerRouteWhenOpen.ts
import { useDrawerStatus } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export function useActiveDrawerRouteWhenOpen() {
    const nav = useNavigation<any>();
    const isOpen = useDrawerStatus() === 'open';
    const [name, setName] = React.useState('index');

    React.useEffect(() => {
        if (!isOpen) return;
        const update = () => {
            const s = nav.getState();
            const r = s.routes[s.index ?? 0];
            setName(r?.name ?? 'index');
        };
        update();
        const unsub = nav.addListener('state', update);
        return unsub;
    }, [isOpen, nav]);

    return isOpen ? name : 'index';
}
