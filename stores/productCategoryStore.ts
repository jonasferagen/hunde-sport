// productCategoryStore.ts
import { ProductCategory } from '@/domain/ProductCategory';
import React from 'react';
import { create } from 'zustand';

type Id = number;

type ProductCategoryState = {
    /** Optional: keep a flat list if you still need it elsewhere */
    items: readonly ProductCategory[];

    /** Fast lookups */
    map: Map<Id, ProductCategory>;
    /** parentId -> visible children (frozen arrays) */
    subcategories: Map<Id, readonly ProductCategory[]>;

    /** Always-available dummy root (id=0) */
    dummyRoot: ProductCategory;

    setProductCategories: (cats: ProductCategory[]) => void;
};

const EMPTY: readonly ProductCategory[] = Object.freeze([]);

export const useProductCategoryStore = create<ProductCategoryState>((set, get) => {
    const dummyRoot = ProductCategory.create(0); // your factory

    return {
        items: [dummyRoot],
        map: new Map<Id, ProductCategory>([[0, dummyRoot]]),
        subcategories: new Map<Id, readonly ProductCategory[]>(),
        dummyRoot,

        setProductCategories: (cats) => {
            const { dummyRoot } = get();

            // ensure 0 exists once; if incoming has id=0, dummy wins
            const all = [dummyRoot, ...cats.filter(c => c.id !== 0)];

            const map = new Map<Id, ProductCategory>();
            const children = new Map<Id, ProductCategory[]>();

            for (const c of all) {
                map.set(c.id, c);
                const p = c.parent ?? 0;
                const arr = children.get(p) ?? [];
                arr.push(c);
                children.set(p, arr);
            }

            // pre-filter visibility once
            const subcategories = new Map<Id, readonly ProductCategory[]>();
            for (const [pid, arr] of children) {
                const list = arr.filter((c) => c.shouldDisplay?.() ?? true);
                subcategories.set(pid, Object.freeze(list));
            }

            set({
                items: Object.freeze(all),
                map,
                subcategories,
            });
        },
    };
});

/** Selectors/hooks */
export const useProductCategory = (id: number): ProductCategory =>
    useProductCategoryStore((s) => s.map.get(id) ?? s.dummyRoot);

export const useProductCategories = (parentId: number): readonly ProductCategory[] =>
    useProductCategoryStore((s) => s.subcategories.get(parentId) ?? EMPTY);




export const useBreadcrumbTrail = (productCategoryId: number): readonly ProductCategory[] => {
    // Stable reference; only changes when setProductCategories() runs at app load
    const map = useProductCategoryStore((s) => s.map);

    return React.useMemo(() => {
        const trail: ProductCategory[] = [];
        let cur = map.get(productCategoryId);
        while (cur && cur.id !== 0) {
            trail.unshift(cur);
            cur = map.get(cur.parent ?? 0);
        }
        return trail;
    }, [map, productCategoryId]);
};
