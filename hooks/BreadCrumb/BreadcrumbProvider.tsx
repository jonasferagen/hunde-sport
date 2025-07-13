import React, { createContext, useCallback, useContext, useState } from 'react';

export interface Crumb {
    id: number | null;
    name: string;
    type: 'category' | 'product' | 'home';
}

interface BreadcrumbContextType {
    breadcrumbs: Crumb[];
    setTrail: (trail: Crumb[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);

    const setTrail = useCallback((newTrail: Crumb[]) => {
        setBreadcrumbs(newTrail);
    }, []);

    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, setTrail }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumbs = () => {
    const context = useContext(BreadcrumbContext);
    if (context === undefined) {
        throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
    }
    return context;
};
