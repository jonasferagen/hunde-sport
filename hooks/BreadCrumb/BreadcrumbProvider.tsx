import type { Breadcrumb } from '@/types';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface BreadcrumbContextType {
    breadcrumbs: Breadcrumb[];
    setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>;
    setTrail: (crumb: Breadcrumb) => void;
    setFullTrail: (trail: Breadcrumb[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

    const setTrail = useCallback((crumb: Breadcrumb) => {
        setBreadcrumbs(prev => {
            // If navigating to home, clear the trail.
            if (crumb.id === null) {
                return [];
            }

            let newTrail = [...prev];

            // If the new crumb is a category, remove any existing product from the end of the trail.
            if (crumb.type === 'category' && newTrail.length > 0 && newTrail[newTrail.length - 1].type === 'product') {
                newTrail.pop();
            }

            const index = newTrail.findIndex(b => b.id === crumb.id && b.type === crumb.type);

            // If the crumb is already in the trail, truncate to that point.
            if (index !== -1) {
                return newTrail.slice(0, index + 1);
            }

            // Otherwise, append the new crumb.
            return [...newTrail, crumb];
        });
    }, []);

    const setFullTrail = useCallback((trail: Breadcrumb[]) => {
        setBreadcrumbs(trail);
    }, []);

    return (
        <BreadcrumbContext.Provider
            value={{
                breadcrumbs,
                setBreadcrumbs,
                setTrail,
                setFullTrail,
            }}
        >
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

export default BreadcrumbProvider;