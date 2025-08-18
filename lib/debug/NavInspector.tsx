// NavInspector.tsx
import { useRootNavigation } from 'expo-router';
import * as React from 'react';

function formatState(state: any, indent = 0): string {
    const pad = ' '.repeat(indent);
    const lines: string[] = [];
    const type = state.type ?? 'nav';
    lines.push(`${pad}${type} (index: ${state.index ?? 0})`);
    for (let i = 0; i < state.routes.length; i++) {
        const r = state.routes[i];
        const focused = i === (state.index ?? 0) ? '•' : '◦';
        lines.push(`${pad}${focused} ${r.name}  key=${r.key}`);
        if (r.state) lines.push(formatState(r.state, indent + 2));
    }
    return lines.join('\n');
}

export function NavInspector() {
    const nav = useRootNavigation();

    React.useEffect(() => {
        if (!nav) return;
        const dump = () => {
            try {
                const s = nav.getState();
                console.log('\n=== NAV TREE ===\n' + formatState(s) + '\n================\n');
            } catch { }
        };
        dump(); // initial
        const unsub = nav.addListener('state', dump);
        return unsub;
    }, [nav]);

    return null;
}
