// Prof.tsx
import React from 'react';
export const Prof: React.FC<{ id: string; children: React.ReactNode; disable?: boolean }> = ({ id, children, disable }) => {


    return (
        <React.Profiler
            key={id}
            id={id}
            onRender={(id, phase, actualDuration) => {
                if (!disable) console.log(`[RENDER] ${id} ${phase} ${actualDuration.toFixed(1)}ms`);
            }}
        >
            {children}
        </React.Profiler>
    );
}
