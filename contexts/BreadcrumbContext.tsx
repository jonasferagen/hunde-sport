import { useCategoryTrail } from '@/hooks/Category';
import { Category, Product } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// A new hook to manage the trail fetching logic
const useBuildTrail = () => {
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const { data: trail, isLoading } = useCategoryTrail(categoryId);
    return { trail, isLoading, build: setCategoryId };
};

// Separate interfaces for state and actions
interface BreadcrumbState {
    categories: Category[];
    isLoading: boolean;
}

interface BreadcrumbActions {
    setBreadcrumb: (category: Category) => void;
    build: (categoryId: number) => void;
    setProductFallback: (product: Product) => void;
}

// Create two separate contexts
const BreadcrumbStateContext = createContext<BreadcrumbState | undefined>(undefined);
const BreadcrumbActionsContext = createContext<BreadcrumbActions | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
    const [categories, setCategoriesState] = useState<Category[]>([]);
    const { trail, isLoading, build } = useBuildTrail();

    // When the trail is fetched, update the context state
    useEffect(() => {
        if (trail) {
            setCategoriesState(trail);
        }
    }, [trail]);

    const setBreadcrumb = useCallback((category: Category) => {
        setCategoriesState(prevCategories => {
            const lastCrumb = prevCategories[prevCategories.length - 1];

            // If the new category is a child of the last one, just append it.
            if (lastCrumb && category.parent === lastCrumb.id) {
                return [...prevCategories, category];
            }

            // Otherwise, rebuild the whole trail.
            build(category.id);
            return []; // Immediately clear breadcrumbs for a clean transition
        });
    }, [build]);

    const setProductFallback = useCallback((product: Product) => {
        const productCategories = product.categories;
        if (productCategories?.length > 0) {
            const lastCrumb = categories[categories.length - 1];

            // If the last breadcrumb is already part of the product's categories, do nothing.
            const isCrumbInProductCategories = productCategories.some(
                (cat) => cat.id === lastCrumb?.id
            );

            if (!isCrumbInProductCategories) {
                console.log("product fallback", productCategories[0].name);
                console.log("last crumb", lastCrumb?.name);
                console.log("product " + product.id + ' ' + product.name);
                //  build(productCategories[0].id);
            }
        }
    }, [categories, build]);

    // Memoize context values to prevent unnecessary re-renders
    const stateValue = useMemo(() => ({ categories, isLoading }), [categories, isLoading]);
    const actionsValue = useMemo(() => ({ setBreadcrumb, build, setProductFallback }), [setBreadcrumb, build, setProductFallback]);

    useEffect(() => {
        console.log('categories updated', categories.map(category => category.name));
    }, [categories]);

    return (
        <BreadcrumbStateContext.Provider value={stateValue}>
            <BreadcrumbActionsContext.Provider value={actionsValue}>
                {children}
            </BreadcrumbActionsContext.Provider>
        </BreadcrumbStateContext.Provider>
    );
};

// New hooks to consume the separate contexts
export const useBreadcrumbState = () => {
    const context = useContext(BreadcrumbStateContext);
    if (!context) {
        throw new Error('useBreadcrumbState must be used within a BreadcrumbProvider');
    }
    return context;
};

export const useBreadcrumbActions = () => {
    const context = useContext(BreadcrumbActionsContext);
    if (!context) {
        throw new Error('useBreadcrumbActions must be used within a BreadcrumbProvider');
    }
    return context;
};
