// usePanelSettled.ts
import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
import { runOnJS, useAnimatedReaction, type SharedValue } from 'react-native-reanimated';

export function useDrawerSettled(progress: SharedValue<number>, eps = 0.001) {
    const [isFullyOpen, setOpen] = useState(progress.value >= 1 - eps);
    const [isFullyClosed, setClosed] = useState(progress.value <= eps);

    useAnimatedReaction(
        () => progress.value,
        (p, prev) => {
            'worklet';
            const was = prev ?? p;
            if (p >= 1 - eps && was < 1 - eps) runOnJS(setOpen)(true), runOnJS(setClosed)(false);
            else if (p <= eps && was > eps) runOnJS(setOpen)(false), runOnJS(setClosed)(true);
        }
    );

    return { isFullyOpen, isFullyClosed };
}

type SheetState = { open: boolean; position: number }; // position is snap index (0 = most open)
export function useSheetSettled(state: SheetState) {
    const targetIsOpen = state.open && state.position === 0;
    const [isFullyOpen, setOpen] = useState(targetIsOpen);
    const [isFullyClosed, setClosed] = useState(!state.open);

    useEffect(() => {
        // Wait until all animations/gestures are done before flipping flags
        const handle = InteractionManager.runAfterInteractions(() => {
            setOpen(targetIsOpen);
            setClosed(!state.open);
        });
        return () => handle.cancel();
    }, [targetIsOpen, state.open]);

    return { isFullyOpen, isFullyClosed };
}
