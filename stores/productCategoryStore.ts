// productCategoryStore.ts
import { ProductCategory } from '@/domain/ProductCategory';
import { create } from 'zustand';

type Id = number;

type ProductCategoryState = {
    // raw list (if you still need it anywhere)
    productCategories: ProductCategory[];

    // fast lookups
    byId: Record<Id, ProductCategory>;
    visibleChildrenByParent: Record<Id, readonly ProductCategory[]>; // arrays are frozen & stable

    // roots for convenience (parent=0)
    rootCategories: readonly ProductCategory[];

    setProductCategories: (cats: ProductCategory[]) => void;
};

export const useProductCategoryStore = create<ProductCategoryState>((set) => ({
    productCategories: [],
    byId: {},
    visibleChildrenByParent: {},
    rootCategories: [],

    setProductCategories: (cats) => {
        // normalize
        const byId: Record<Id, ProductCategory> = {};
        const childrenByParent: Record<Id, ProductCategory[]> = {};

        for (const c of cats) {
            byId[c.id] = c;
            const p = c.parent ?? 0;
            (childrenByParent[p] ??= []).push(c);
        }

        // apply shouldDisplay once; freeze arrays for referential stability
        const visibleChildrenByParent: Record<Id, readonly ProductCategory[]> = {};
        for (const [pidStr, arr] of Object.entries(childrenByParent)) {
            const list = arr.filter((c) => c.shouldDisplay());
            visibleChildrenByParent[+pidStr] = Object.freeze(list);
        }

        const root: readonly ProductCategory[] = Object.freeze(visibleChildrenByParent[0] ?? []);

        set({
            productCategories: cats,          // keep if other code uses it
            byId,
            visibleChildrenByParent,
            rootCategories: root,
        });
    },
}));



export const useCategoryById = (id: number): ProductCategory =>
    useProductCategoryStore((s) => s.byId[id]);

export const useVisibleChildren = (parentId: number): readonly ProductCategory[] =>
    useProductCategoryStore(
        (s) => s.visibleChildrenByParent[parentId] ?? EMPTY,
    );

const EMPTY: readonly ProductCategory[] = Object.freeze([]);
