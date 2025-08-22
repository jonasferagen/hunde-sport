// hooks/useEdgeFades.ts
import * as React from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type Orientation = 'horizontal' | 'vertical';

export function useEdgeFades(orientation: Orientation) {
    const [atStart, setAtStart] = React.useState(true);
    const [atEnd, setAtEnd] = React.useState(false);

    const containerMain = React.useRef(0); // width or height (viewport)
    const contentMain = React.useRef(0); // content width or height
    const lastStart = React.useRef(true);
    const lastEnd = React.useRef(false);

    const recomputeEdges = React.useCallback(() => {
        // If content shorter than viewport → both fades off
        const end = containerMain.current >= contentMain.current - 1;
        if (end !== lastEnd.current) { lastEnd.current = end; setAtEnd(end); }
    }, []);

    const onLayout = React.useCallback((e: any) => {
        const { width, height } = e.nativeEvent.layout;
        containerMain.current = orientation === 'horizontal' ? width : height;
        recomputeEdges();
    }, [orientation, recomputeEdges]);

    // FlashList gives (w,h). ScrollView/FlatList too.
    const onContentSizeChange = React.useCallback((w: number, h?: number) => {
        const main = orientation === 'horizontal' ? w : (h ?? 0);
        contentMain.current = main;
        recomputeEdges();
    }, [orientation, recomputeEdges]);

    const onScroll = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const off = orientation === 'horizontal'
            ? e.nativeEvent.contentOffset.x
            : e.nativeEvent.contentOffset.y;

        const start = off <= 1;
        const end = off + containerMain.current >= contentMain.current - 1;

        console.log(contentMain.current);

        if (start !== lastStart.current) { lastStart.current = start; setAtStart(start); }
        if (end !== lastEnd.current) { lastEnd.current = end; setAtEnd(end); }
    }, [orientation]);

    return { atStart, atEnd, onLayout, onContentSizeChange, onScroll };
}
