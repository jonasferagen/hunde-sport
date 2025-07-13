import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface Crumb {
    id: number | null;
    name: string;
    type: 'category' | 'product' | 'home';
}

interface BreadcrumbContextType {
    breadcrumbs: Crumb[];
    handleNavigation: (trail: Crumb[]) => void;
    setTrail: (trail: Crumb[]) => void;
    navigateToCrumb: (crumb: Crumb) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

const HOME_CRUMB: Crumb = { id: null, name: 'Hjem', type: 'home' };

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([HOME_CRUMB]);

    const setTrail = useCallback((newTrail: Crumb[]) => {
        setBreadcrumbs(newTrail);
    }, [setBreadcrumbs]);

    const navigateToCrumb = useCallback((crumb: Crumb) => {
        const newTrail = [...breadcrumbs, crumb];
        handleNavigation(newTrail);
    }, [breadcrumbs, handleNavigation]);

    const handleNavigation = useCallback((newTrail: Crumb[]) => {
        setBreadcrumbs(newTrail);

        const destination = newTrail[newTrail.length - 1];
        if (!destination) return;

        if (destination.type === 'home') {
            router.replace('/');
        } else {
            router.push({
                pathname: '/(drawer)/category',
                params: {
                    id: destination.id?.toString(),
                    name: destination.name,
                },
            });
        }
    }, [setBreadcrumbs]);

    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, handleNavigation, setTrail, navigateToCrumb }}>
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
