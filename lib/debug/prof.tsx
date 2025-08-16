// Prof.tsx
import React from 'react';
export const Prof: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {


    return (
        <React.Profiler
            id={id}
            onRender={(id, phase, actualDuration) => {
                if (actualDuration > 8) {
                    // only log "slow" commits
                    console.log(`[RENDER] ${id} ${phase} ${actualDuration.toFixed(1)}ms`);
                }
            }}
        >
            {children}
        </React.Profiler>
    );
}
