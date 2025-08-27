// stores/useProductVariationStore.ts (leaner state)
/** Reactive selectors (v5 + useShallow) */
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { ProductAttributeHelper } from "@/domain/Product/ProductAttributeHelper";
import {
  getProductPriceRange,
  ProductAttributeTaxonomy as Taxonomy,
  ProductAttributeTerm as Term,
  ProductPriceRange,
  ProductVariation,
  VariableProduct,
} from "@/types";

export type TermSelection = Map<string, Term | null>;
export type TermOption = {
  variationIds: number[];
  term: Term;
  enabled?: boolean; // computed; not stored in state
};
export type TermOptionGroup = {
  taxonomy: Taxonomy;
  options: TermOption[];
};

type State = {
  product: VariableProduct | null;
  options: TermOption[];
  selection: TermSelection;
  variationById: Map<number, ProductVariation>;
};

type Actions = {
  init(product: VariableProduct): void;
  setVariations(variations: ProductVariation[]): void;
  select(taxonomy: string, term: Term | null): void;
  reset(): void;
  getVariation(id: number): ProductVariation | undefined;
  priceRangeForIds(ids: number[]): ProductPriceRange | null;
  getSelectedVariationId(): number | undefined;
  getSelectedVariation(): ProductVariation | undefined;
};

const emptySelection = () => new Map<string, Term | null>();
const initialState: State = {
  product: null,
  options: [],
  selection: emptySelection(),
  variationById: new Map(),
};

export const useVariableProductStore = create<State & Actions>()(
  (set, get) => ({
    ...initialState,

    reset() {
      set(() => initialState);
    },

    init(product) {
      const options = ProductAttributeHelper.create(product);
      // seed empty selection with all taxonomies from options
      const selection = emptySelection();
      ProductAttributeHelper.groupByTaxonomy(options).forEach((g) =>
        selection.set(g.taxonomy.name, null)
      );
      set({
        ...initialState,
        product,
        options,
        selection,
        variationById: new Map(),
      });
    },

    setVariations(variations) {
      set({ variationById: new Map(variations.map((v) => [v.id, v])) });
    },

    select(taxonomy, term) {
      const prev = get().selection;
      const next = new Map(prev);
      next.set(taxonomy, term);
      set({ selection: next });
    },

    getVariation(id) {
      return get().variationById.get(id);
    },

    priceRangeForIds(ids) {
      const unique = Array.from(new Set(ids));
      const prices = unique
        .map((id) => get().variationById.get(id)?.prices)
        .filter((p): p is NonNullable<typeof p> => !!p);
      return prices.length ? getProductPriceRange(prices) : null;
    },

    getSelectedVariationId() {
      const { options, selection } = get();

      return ProductAttributeHelper.resolveSelectedVariationId(
        options,
        selection
      );
    },

    getSelectedVariation() {
      const id = get().getSelectedVariationId();
      return id ? get().variationById.get(id) : undefined;
    },
  })
);

export const useGroups = () =>
  useVariableProductStore(
    useShallow((s) => {
      const flagged = ProductAttributeHelper.withEnabled(
        s.options,
        s.selection
      );
      return ProductAttributeHelper.groupByTaxonomy(flagged);
    })
  );

export const useSelectedVariation = () =>
  useVariableProductStore(
    useShallow((s) => {
      const id = ProductAttributeHelper.resolveSelectedVariationId(
        s.options,
        s.selection
      );
      return id ? s.variationById.get(id) : undefined;
    })
  );
