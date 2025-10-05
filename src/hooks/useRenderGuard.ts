import { useEffect, useRef } from 'react';

const RENDER_THRESHOLD = 10; // 10 renders
const TIME_FRAME_MS = 500;   // within 500ms

export const useRenderGuard = (componentName: string) => {
    const renderTimestamps = useRef<number[]>([]);

    useEffect(() => {
        const now = Date.now();
        const newTimestamps = [
            ...renderTimestamps.current,
            now,
        ].filter(timestamp => now - timestamp < TIME_FRAME_MS);

        if (newTimestamps.length > RENDER_THRESHOLD) {
            console.warn(
                `Component "${componentName}" is re-rendering excessively.`,
                `It rendered ${newTimestamps.length} times in the last ${TIME_FRAME_MS}ms.`
            );
            // In development, you could even throw an error
            if (__DEV__) {
                throw new Error(`Excessive re-renders in ${componentName}`);
            }
        }

        renderTimestamps.current = newTimestamps;
    });
};