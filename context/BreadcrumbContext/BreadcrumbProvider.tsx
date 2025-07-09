import type { Breadcrumb } from '@/types';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface BreadcrumbContextType {
    breadcrumbs: Breadcrumb[];
    setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>;
    setTrail: (crumb: Breadcrumb) => void;
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

            const index = prev.findIndex(b => b.id === crumb.id && b.type === crumb.type);

            // If the crumb is already in the trail, truncate to that point.
            if (index !== -1) {
                return prev.slice(0, index + 1);
            }

            // If the last crumb is a product, replace it with the new crumb.
            if (prev.length > 0 && prev[prev.length - 1].type === 'product') {
                return [...prev.slice(0, -1), crumb];
            }

            // Otherwise, append the new crumb.
            return [...prev, crumb];
        });
    }, []);

    return (
        <BreadcrumbContext.Provider
            value={{
                breadcrumbs,
                setBreadcrumbs,
                setTrail,
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