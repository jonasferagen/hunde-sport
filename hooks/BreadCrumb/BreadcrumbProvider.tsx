import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface Crumb {
    id: number | null;
    name: string;
    type: 'category' | 'product' | 'home';
    image: any; // Add image property to Crumb interface
}

interface BreadcrumbContextType {
    breadcrumbs: Crumb[];
    handleNavigation: (trail: Crumb[]) => void;
    setTrail: (trail: Crumb[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);

    const setTrail = useCallback((newTrail: Crumb[]) => {
        setBreadcrumbs(newTrail);
    }, []);

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
                    image: JSON.stringify(destination.image),
                },
            });
        }
    }, []);

    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, handleNavigation, setTrail }}>
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
