import { Breadcrumb, Category, Product } from '@/types';
import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface BreadcrumbContextType {
    breadcrumbs: Breadcrumb[];
    navigate: (crumb: Breadcrumb) => void;
    setCategories: (categories: Category[], go?: boolean) => void;
    addCategory: (category: Category) => void;
    setProductCrumb: (product: Product | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {

    const [trail, setTrailState] = useState<Breadcrumb[]>([]);
    const [productCrumb, setProductCrumb] = useState<Breadcrumb | null>(null);

    const breadcrumbs = useMemo(() => {
        return productCrumb ? [...trail, productCrumb] : trail;
    }, [trail, productCrumb]);

    const navigate = useCallback((crumb: Breadcrumb) => {

        console.log('navigating to ' + crumb.name);

        if (crumb.type !== 'product') {
            setProductCrumb(null);
        }

        const crumbIndex = trail.findIndex(c => c.id === crumb.id && c.type === crumb.type);
        if (crumbIndex !== -1) {
            const newTrail = trail.slice(0, crumbIndex + 1);
            setTrailState(newTrail);
        }

        if (crumb.type === 'home') {
            setTrailState([]);
            return router.push('/');
        }

        const { id, name, type } = crumb;
        return router.push(`/${type}?id=${id}&name=${name}`);

    }, [trail]);

    const setCategories = useCallback((categories: Category[], go = true) => {
        setProductCrumb(null);

        const categoryCrumbs: Breadcrumb[] = categories.map(category => ({
            id: category.id,
            name: category.name,
            type: 'category',
            parent: category.parent,
        }));

        setTrailState(categoryCrumbs);

        if (go && categoryCrumbs.length > 0) {
            navigate(categoryCrumbs[categoryCrumbs.length - 1]);
        }
    }, [navigate]);

    const addCategory = useCallback((category: Category) => {
        setProductCrumb(null);

        const lastCrumb = trail[trail.length - 1];
        const newCrumb: Breadcrumb = { id: category.id, name: category.name, type: 'category' as const };

        let newTrail: Breadcrumb[] = [newCrumb]; // Default to a new trail

        if (lastCrumb && lastCrumb.type === 'category' && category.parent === lastCrumb.id) {
            newTrail = [...trail, newCrumb]; // Append to existing trail
        }

        setTrailState(newTrail);
        navigate(newTrail[newTrail.length - 1]);

    }, [trail, navigate]);

    const handleSetProductCrumb = useCallback((product: Product | null) => {
        if (product) {
            setProductCrumb({ id: product.id, name: product.name, type: 'product' });
        } else {
            setProductCrumb(null);
        }
    }, []);

    useEffect(() => {
        console.log('breadcrumbs updated', breadcrumbs.map(crumb => crumb.name));
    }, [breadcrumbs]);

    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, navigate, setCategories, addCategory, setProductCrumb: handleSetProductCrumb }}>
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

export const useProductBreadcrumb = (product: Product) => {
    const { setProductCrumb } = useBreadcrumbs();
    useEffect(() => {
        setProductCrumb(product);
    }, [product]);
};
