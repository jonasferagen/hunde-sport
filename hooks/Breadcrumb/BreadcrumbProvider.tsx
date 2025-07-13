import { Breadcrumb } from '@/types';
import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface BreadcrumbContextType {
    init: () => Breadcrumb[];
    breadcrumbs: Breadcrumb[];
    handleNavigation: (trail: Breadcrumb[]) => void;
    setTrail: (trail: Breadcrumb[], navigate?: boolean) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

const HOME_CRUMB: Breadcrumb = { id: null, name: 'Hjem', type: 'home' };

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {

    const init = () => [HOME_CRUMB];

    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>(init());

    const setTrail = useCallback((trail: Breadcrumb[], navigate = false) => {

        console.log("setTrail: ", trail);
        setBreadcrumbs(trail);
        if (navigate) {
            handleNavigation(trail);
        }
    }, [setBreadcrumbs]);

    const handleNavigation = useCallback((trail: Breadcrumb[]) => {
        const destination = trail[trail.length - 1];
        if (destination.type === 'home') {
            router.replace('/');
        } else {
            router.push({
                pathname: '/(drawer)/category',
                params: {
                    id: destination.id,
                    name: destination.name,
                },
            });
        }
    }, []);

    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, init, handleNavigation, setTrail }}>
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
