// @/domain/Product/helpers/createVariationStore.ts
import { createStore } from 'zustand/vanilla';
import { VariableProductOptions, Option, OptionGroup } from './VariableProductOptions';
import { ProductVariationCollection } from './ProductVariationCollection';
import type { VariableProduct } from '../VariableProduct';


type Taxonomy = string;
type Slug = string;

export type Selection = Record<Taxonomy, Slug | null>;

export type FilteredOption = Option & {
    compatibleVariationIds: number[];
    disabled: boolean;
    selected: boolean;
};

export type FilteredGroup = Omit<OptionGroup, 'options'> & {
    options: FilteredOption[];
};

type Internal = {
    opts: VariableProductOptions;
    groups: OptionGroup[];
    allVariationIds: number[];
};

export type VariationState = {
    // data
    productId: number | null;
    selection: Selection;
    internal: Internal | null;
    collection: ProductVariationCollection | null;

    // actions
    setProduct: (product: VariableProduct, collection: ProductVariationCollection) => void;
    select: (taxonomy: Taxonomy, slug: Slug | null) => void;
    clear: (taxonomy?: Taxonomy) => void;

    // derived
    getFilteredOptionGroups: () => FilteredGroup[];
    getActiveVariationIds: () => number[];
    getResolvedVariationId: () => number | null;
};

const intersect = (a: number[], b: number[]) => {
    if (!a.length || !b.length) return [];
    const s = new Set(b);
    const out: number[] = [];
    for (const x of a) if (s.has(x)) out.push(x);
    return out;
};

export function createVariationStore() {
    return createStore<VariationState>((set, get) => ({
        productId: null,
        selection: {},
        internal: null,
        collection: null,

        setProduct: (product, collection) => {
            const opts = new VariableProductOptions(product);
            const groups = opts.getOptionGroups();

            // init selection map with nulls
            const selection: Selection = {};
            for (const g of groups) selection[g.taxonomy] = null;

            // union of all variation ids
            const idSet = new Set<number>();
            for (const g of groups) for (const o of g.options) for (const l of o.linked) idSet.add(l.variationId);

            set({
                productId: product.id,
                selection,
                internal: {
                    opts,
                    groups,
                    allVariationIds: Array.from(idSet),
                },
                collection,
            });
        },

        select: (taxonomy, slug) => {
            const st = get();
            if (!st.internal) return;
            if (!(taxonomy in st.selection)) return;
            set({ selection: { ...st.selection, [taxonomy]: slug } });
        },

        clear: (taxonomy) => {
            const st = get();
            if (!st.internal) return;
            if (taxonomy) {
                if (taxonomy in st.selection) set({ selection: { ...st.selection, [taxonomy]: null } });
                return;
            }
            const cleared: Selection = {};
            for (const t of Object.keys(st.selection)) cleared[t] = null;
            set({ selection: cleared });
        },

        getActiveVariationIds: () => {
            const st = get();
            const internal = st.internal;
            if (!internal) return [];
            const pairs = Object.entries(st.selection).filter(([, s]) => !!s) as Array<[Taxonomy, Slug]>;
            if (pairs.length === 0) return internal.allVariationIds.slice();

            const idsFor = (tx: Taxonomy, slug: Slug): number[] => {
                const g = internal.groups.find(x => x.taxonomy === tx);
                const o = g?.options.find(x => x.slug === slug);
                return o ? o.linked.map(l => l.variationId) : [];
            };

            let cur = idsFor(pairs[0][0], pairs[0][1]);
            for (let i = 1; i < pairs.length; i++) cur = intersect(cur, idsFor(pairs[i][0], pairs[i][1]));
            return cur;
        },

        getFilteredOptionGroups: () => {
            const st = get();
            const internal = st.internal;
            if (!internal) return [];

            const idsFor = (tx: Taxonomy, slug: Slug): number[] => {
                const g = internal.groups.find(x => x.taxonomy === tx);
                const o = g?.options.find(x => x.slug === slug);
                return o ? o.linked.map(l => l.variationId) : [];
            };

            return internal.groups.map(group => {
                const otherPairs = Object.entries(st.selection)
                    .filter(([tx, s]) => tx !== group.taxonomy && !!s) as Array<[Taxonomy, Slug]>;

                const baseIds =
                    otherPairs.length === 0
                        ? internal.allVariationIds
                        : otherPairs.map(([tx, s]) => idsFor(tx, s)).reduce(intersect);

                const options: FilteredOption[] = group.options.map(opt => {
                    const optIds = opt.linked.map(l => l.variationId);
                    const compatibleVariationIds = intersect(baseIds, optIds);
                    const selected = st.selection[group.taxonomy] === opt.slug;
                    const disabled = compatibleVariationIds.length === 0 && !selected;
                    return { ...opt, compatibleVariationIds, disabled, selected };
                });

                return { attributeId: group.attributeId, taxonomy: group.taxonomy, label: group.label, options };
            });
        },

        getResolvedVariationId: () => {
            const ids = get().getActiveVariationIds();
            return ids.length === 1 ? ids[0] : null;
        },
    }));
}
