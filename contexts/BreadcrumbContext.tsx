import { getCategory } from '@/hooks/Category';
import { Category } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface BreadcrumbContextType {
    categories: Category[];
    setCategory: (category: Category | null) => void;
    isLoading: boolean;
}

export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
    undefined
);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
    const [leafCategory, setLeafCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchParents = async () => {
            if (!leafCategory) {
                setCategories([]);
                return;
            }

            setLoading(true);
            const breadcrumbs: Category[] = [leafCategory];
            let parentId = leafCategory.parent;

            while (parentId && parentId !== 0) {
                try {
                    const parentCategory = await getCategory(parentId, queryClient);
                    if (parentCategory) {
                        breadcrumbs.unshift(parentCategory);
                        parentId = parentCategory.parent;
                    } else {
                        break; // Stop if a parent isn't found
                    }
                } catch (error) {
                    console.error('Failed to fetch parent category:', error);
                    break; // Stop on error
                }
            }
            setCategories(breadcrumbs);
            setLoading(false);
        };

        fetchParents();
    }, [leafCategory, queryClient]);

    const setCategory = (category: Category | null) => {
        setLeafCategory(category);
    };

    return (
        <BreadcrumbContext.Provider value={{ categories, setCategory, isLoading }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumbContext = () => {
    const context = useContext(BreadcrumbContext);
    if (context === undefined) {
        throw new Error('useBreadcrumbContext must be used within a BreadcrumbProvider');
    }
    return context;
};
