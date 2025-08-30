// productCategoryStore.ts
import React from "react";
import { create } from "zustand";

import { ProductCategory } from "@/domain/product-category/ProductCategory";

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

export const useProductCategoryStore = create<ProductCategoryState>(
  (set, get) => {
    const dummyRoot = ProductCategory.ROOT;

    return {
      items: [dummyRoot],
      map: new Map<Id, ProductCategory>([[0, dummyRoot]]),
      subcategories: new Map<Id, readonly ProductCategory[]>(),
      dummyRoot,

      setProductCategories: (cats) => {
        const sorted = [...cats].sort((a, b) =>
          a.name.localeCompare(b.name, "nb", { sensitivity: "base" })
        );
        const { dummyRoot } = get();

        const all = [dummyRoot, ...sorted.filter((c) => c.id !== 0)];

        const map = new Map<Id, ProductCategory>();
        const children = new Map<Id, ProductCategory[]>();

        for (const c of all) {
          map.set(c.id, c);

          // normalize parent
          const rawParent = c.parent;
          const p =
            typeof rawParent === "number" && Number.isFinite(rawParent)
              ? rawParent
              : 0; // treat null/undefined as root’s children

          // guard: avoid self-parent loops
          const parentId = p === c.id ? 0 : p;

          const arr = children.get(parentId) ?? [];
          if (c.id !== 0) arr.push(c); // don’t include dummyRoot as a child
          children.set(parentId, arr);
        }

        const subcategories = new Map<Id, readonly ProductCategory[]>();
        for (const [pid, arr] of children) {
          const list = arr.filter((c) => (c as any).shouldDisplay?.() ?? true);
          subcategories.set(pid, Object.freeze(list));
        }

        set({
          items: Object.freeze(all),
          map,
          subcategories,
        });
      },
    };
  }
);

/** Selectors/hooks */
export const useProductCategory = (id: number): ProductCategory =>
  useProductCategoryStore((s) => s.map.get(id) ?? s.dummyRoot);

export const useProductCategories = (
  parentId: number
): readonly ProductCategory[] =>
  useProductCategoryStore((s) => s.subcategories.get(parentId) ?? EMPTY);

export const useBreadcrumbTrail = (
  productCategoryId: number
): readonly ProductCategory[] => {
  const map = useProductCategoryStore((s) => s.map);

  return React.useMemo(() => {
    const trail: ProductCategory[] = [];
    let cur = map.get(productCategoryId);

    while (cur) {
      trail.unshift(cur);
      if (cur.isTopLevel) break;
      cur = map.get(cur.parent);
    }

    // ensure synthetic root at the very start
    if (trail.length === 0 || trail[0].id !== ProductCategory.ROOT.id) {
      trail.unshift(ProductCategory.ROOT);
    }

    return trail;
  }, [map, productCategoryId]);
};
