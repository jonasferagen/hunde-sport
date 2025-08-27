// stores/useVariableProductStore.ts
import { create } from 'zustand';

import { type SelectOption, type Taxonomy, type Term,VariableProductOptions } from '@/domain/Product/helpers/VariableProductOptions';
import type { VariableProduct } from '@/domain/Product/VariableProduct';
import type { ProductPriceRange, ProductVariation } from '@/types';
import { getProductPriceRange } from '@/types';

export type TermSelection = Map<string, Term | null>;

type Group = { taxonomy: Taxonomy; options: SelectOption[] };

type State = {
  product: VariableProduct | null;
  options: SelectOption[];            // base (no enabled)
  flaggedOptions: SelectOption[];     // with enabled flag
  groups: Group[];                    // grouped flaggedOptions
  selection: TermSelection;
  variationById: Map<number, ProductVariation>;
  selectedVariation?: ProductVariation;
};

type Actions = {
  init(product: VariableProduct, variations: ProductVariation[]): void;
  select(taxonomy: string, term: Term | null): void;
  reset(): void;

  // lookups/util
  getVariation(id: number): ProductVariation | undefined;
  priceRangeForIds(ids: number[]): ProductPriceRange | null;
};

const emptySelection = () => new Map<string, Term | null>();

const initialState: State = {
  product: null,
  options: [],
  flaggedOptions: [],
  groups: [],
  selection: emptySelection(),
  variationById: new Map(),
  selectedVariation: undefined,
};

export const useVariableProductStore = create<State & Actions>()((set, get) => ({
  ...initialState,

  init(product, variations) {
    const options = VariableProductOptions.create(product);
    const baseGroups = VariableProductOptions.group(options);

    const selection = emptySelection();
    for (const g of baseGroups) selection.set(g.taxonomy.name, null);

    const variationById = new Map<number, ProductVariation>(
      (variations ?? []).map(v => [v.id, v])
    );

    const flaggedOptions = VariableProductOptions.withEnabled(options, selection);
    const groups = VariableProductOptions.group(flaggedOptions);

    const selectedId = VariableProductOptions.resolveSelectedVariationId(options, selection);
    const selectedVariation = selectedId ? variationById.get(selectedId) : undefined;

    set({ product, options, flaggedOptions, groups, selection, variationById, selectedVariation });
  },

  select(taxonomy, term) {
    const { selection: prevSel, options, variationById } = get();

    // immutable Map update
    const selection = new Map(prevSel);
    selection.set(taxonomy, term);

    const flaggedOptions = VariableProductOptions.withEnabled(options, selection);
    const groups = VariableProductOptions.group(flaggedOptions);

    const selectedId = VariableProductOptions.resolveSelectedVariationId(options, selection);
    const selectedVariation = selectedId ? variationById.get(selectedId) : undefined;

    set({ selection, flaggedOptions, groups, selectedVariation });
  },

  reset() {
    set(initialState);
  },

  getVariation(id) {
    return get().variationById.get(id);
  },

  priceRangeForIds(ids) {
    const unique = Array.from(new Set(ids));
    const prices = unique
      .map(id => get().variationById.get(id)?.prices)
      .filter((p): p is NonNullable<typeof p> => !!p);

    return prices.length ? getProductPriceRange(prices) : null;
  },
}));
