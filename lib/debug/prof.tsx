// Prof.tsx
import React from 'react';
export const Prof: React.FC<{
    id: string;
    children: React.ReactNode;
    disable?: boolean
}> = ({ id,
    children,
    disable
}) => {
        return (
            <React.Profiler
                id={id}
                onRender={(id, phase, actual, base, start, commit) => {
                    console.log(
                        `[RENDER] ${id} ${phase} actual=${actual.toFixed(1)}ms base=${base.toFixed(1)}ms start=${start.toFixed(1)} commit=${commit.toFixed(1)}`
                    );
                }}
            >
                {children}
            </React.Profiler>
        );
    }
