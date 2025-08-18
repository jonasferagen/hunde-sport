import { useNavigationState } from '@react-navigation/native'; // useActiveRoutePath.ts

export function useActiveRoutePath() {
    return useNavigationState((state) => {
        const names: string[] = [];
        let s: any = state;
        while (s && s.routes) {
            const r = s.routes[s.index ?? 0];
            names.push(r.name);
            s = r.state;
        }
        return names; // e.g. ["(app)", "Drawer", "index"]
    });
}
