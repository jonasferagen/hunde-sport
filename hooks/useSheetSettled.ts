
import { useEffect, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';
type Options = {
    eps?: number;                       // threshold for 0/1
    readyDelay?: 'none' | 'interactions'; // when to flip 'readyForHeavyMount'
};



type SheetState = { open: boolean; position: number }; // position is snap index (0 = most open)
export function useSheetSettled(
    state: SheetState,
    opts: Options & { openIndex?: number } = {}
) {
    const { readyDelay = 'none', openIndex = 0 } = opts;

    const atOpenNow = !!state.open && (state.position ?? -1) === openIndex;

    const [isFullyOpen, setIsFullyOpen] = useState(atOpenNow);
    const [isFullyClosed, setIsFullyClosed] = useState(!state.open);

    const openedOnceRef = useRef(atOpenNow);
    const [openedOnce, setOpenedOnce] = useState(atOpenNow);
    const [readyForHeavyMount, setReady] = useState(atOpenNow);

    const queueReady = () => {
        if (readyDelay === 'interactions') {
            InteractionManager.runAfterInteractions(() => setReady(true));
        } else {
            setReady(true);
        }
    };

    useEffect(() => {
        const atOpen = !!state.open && (state.position ?? -1) === openIndex;
        const atClosed = !state.open;

        setIsFullyOpen(atOpen);
        setIsFullyClosed(atClosed);

        // Flip one-shot flags on first "fully open"
        if (atOpen && !openedOnceRef.current) {
            openedOnceRef.current = true;
            setOpenedOnce(true);
            queueReady();
        }
        // We do NOT reset ready/openedOnce on close; they’re one-shot by design.
    }, [state.open, state.position, openIndex, readyDelay]);

    return { isFullyOpen, isFullyClosed, openedOnce, readyForHeavyMount };
}