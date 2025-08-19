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

        if (disable) return <>{children}</>;

        return (
            <React.Profiler
                id={id}
                onRender={(id, phase, actual, base, start, commit) => {
                    console.log(
                        `[RENDER] ${id}  ${phase} duration=${actual.toFixed(1)}ms `
                    );
                }}
            >
                {children}
            </React.Profiler >
        );
    }
