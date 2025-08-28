// useProductVariationStore.ts
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { ProductAttributeHelper } from "@/domain/Product/ProductAttributeHelper";
import type {
  ProductAttributeTaxonomy as Taxonomy,
  ProductAttributeTerm as Term,
  ProductPriceRange,
  ProductVariation,
  VariableProduct,
} from "@/types";
import { getProductPriceRange } from "@/types";

export type TermSelection = Map<string, Term | null>;
export type TermOption = {
  variationIds: number[];
  term: Term;
  enabled?: boolean;
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
  priceRangeForIds(ids: number[]): ProductPriceRange | null;
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
      // seed selection from canonical product.taxonomies (order preserved)
      const selection = new Map<string, Term | null>();
      for (const name of (
        product.taxonomies ?? new Map<string, Taxonomy>()
      ).keys()) {
        selection.set(name, null);
      }
      set({ product, options, selection, variationById: new Map() });
    },

    setVariations(variations) {
      set({ variationById: new Map(variations.map((v) => [v.id, v])) });
    },

    select(taxonomy, term) {
      const next = new Map(get().selection);
      next.set(taxonomy, term);
      set({ selection: next });
    },

    priceRangeForIds(ids) {
      const unique = Array.from(new Set(ids));
      const prices = unique
        .map((id) => get().variationById.get(id)?.prices)
        .filter((p): p is NonNullable<typeof p> => !!p);
      return prices.length ? getProductPriceRange(prices) : null;
    },
  })
);

// Optional tiny reactive hook for the variation id
export const useSelectedVariationId = () =>
  useVariableProductStore(
    useShallow((s) =>
      ProductAttributeHelper.resolveSelectedVariationId(s.options, s.selection)
    )
  );
