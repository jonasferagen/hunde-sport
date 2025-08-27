// stores/useProductVariationStore.ts
import { create } from "zustand";

import {
  type SelectOption,
  type Taxonomy,
  type Term,
  VariableProductOptions,
} from "@/domain/Product/helpers/VariableProductOptions";
import type { VariableProduct } from "@/domain/Product/VariableProduct";
import type { ProductPriceRange, ProductVariation } from "@/types";
import { getProductPriceRange } from "@/types";

export type TermSelection = Map<string, Term | null>;
type Group = { taxonomy: Taxonomy; options: SelectOption[] };

type State = {
  product: VariableProduct | null;
  options: SelectOption[]; // base options (no variation deps)
  flaggedOptions: SelectOption[]; // options with enabled flag
  groups: Group[]; // grouped flaggedOptions
  selection: TermSelection;
  variationById: Map<number, ProductVariation>;
};

type Actions = {
  init(product: VariableProduct): void; // reset + build from product only
  setVariations(variations: ProductVariation[]): void; // supply variations later
  select(taxonomy: string, term: Term | null): void; // update selection
  reset(): void;

  // lookups/util
  getVariation(id: number): ProductVariation | undefined;
  priceRangeForIds(ids: number[]): ProductPriceRange | null;

  // derived getters (non-reactive unless used via a selector)
  getSelectedVariationId(): number | undefined;
  getSelectedVariation(): ProductVariation | undefined;
};

const emptySelection = () => new Map<string, Term | null>();

const initialState: State = {
  product: null,
  options: [],
  flaggedOptions: [],
  groups: [],
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
      // Build from product only (atomic snapshot)
      const options = VariableProductOptions.create(product);
      const baseGroups = VariableProductOptions.group(options);

      const selection = emptySelection();
      for (const g of baseGroups) selection.set(g.taxonomy.name, null);

      const flaggedOptions = VariableProductOptions.withEnabled(
        options,
        selection
      );
      const groups = VariableProductOptions.group(flaggedOptions);

      set({
        ...initialState,
        product,
        options,
        flaggedOptions,
        groups,
        selection,
        variationById: new Map(), // no variations yet
      });
    },

    setVariations(variations) {
      console.warn("setting variations");

      const variationById = new Map<number, ProductVariation>(
        (variations ?? []).map((v) => [v.id, v])
      );
      set({ variationById });
    },

    select(taxonomy, term) {
      const { selection: prevSel, options } = get();

      const selection = new Map(prevSel);
      selection.set(taxonomy, term);

      const flaggedOptions = VariableProductOptions.withEnabled(
        options,
        selection
      );
      const groups = VariableProductOptions.group(flaggedOptions);

      set({ selection, flaggedOptions, groups });
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

    // ----- Derived getters -----
    getSelectedVariationId() {
      const { options, selection } = get();
      return VariableProductOptions.resolveSelectedVariationId(
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

/** Reactive selector for selected variation (recommended for components). */
export const selectSelectedVariation = (s: State) => {
  const id = VariableProductOptions.resolveSelectedVariationId(
    s.options,
    s.selection
  );
  return id ? s.variationById.get(id) : undefined;
};
