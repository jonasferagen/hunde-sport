import { useEffect, useRef, useState } from 'react';

type Options = {
    openIndex?: number; // which snap index counts as "fully open" (0 = most open)
};

type SheetState = { open: boolean; position: number }; // position is snap index (0 = most open)
export function useSheetSettled(
    state: SheetState,
    opts: Options = {}
) {
    const { openIndex = 0 } = opts;

    const atOpenNow = !!state.open && (state.position ?? -1) === openIndex;

    const [isFullyOpen, setIsFullyOpen] = useState(atOpenNow);
    const [isFullyClosed, setIsFullyClosed] = useState(!state.open);

    const openedOnceRef = useRef(atOpenNow);
    const [openedOnce, setOpenedOnce] = useState(atOpenNow);

    useEffect(() => {
        const atOpen = !!state.open && (state.position ?? -1) === openIndex;
        const atClosed = !state.open;

        setIsFullyOpen(atOpen);
        setIsFullyClosed(atClosed);

        // Flip one-shot flags on first "fully open"
        if (atOpen && !openedOnceRef.current) {
            openedOnceRef.current = true;
            setOpenedOnce(true);
        }
        // We do NOT reset ready/openedOnce on close; they’re one-shot by design.
    }, [state.open, state.position, openIndex]);

    return { isFullyOpen, isFullyClosed, openedOnce };
}