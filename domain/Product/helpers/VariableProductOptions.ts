// lib/VariableProductOptions.ts
import { ProductAttribute, ProductAttributeTerm } from '@/domain/Product/ProductAttribute';
import type { VariableProduct } from '@/domain/Product/VariableProduct';

const norm = (s: string) => String(s ?? '').trim().toLowerCase();

export type Linked = {
    variationId: number;
    term: { taxonomy: string; slug: string } | null; // "other" term only
};

export type Option = {
    slug: string;   // term slug (e.g., "xl")
    label: string;  // term display (e.g., "XL")
    linked: Linked[];
};

export type OptionGroup = {
    attributeId: number;
    taxonomy: string; // e.g., pa_storrelse
    label: string;    // e.g., Størrelse
    options: Option[];
};

type VariationAny = {
    id: number;
    attributes: Array<{ name: string; value?: string; option?: string }>;
};

export class VariableProductOptions {
    // maps
    private attributeMap: Record<string, ProductAttributeTerm[]> = {};
    private variationByAttribute: Record<string, Record<string, number[]>> = {};
    private variationIdToTerms: Record<number, Array<{ taxonomy: string; slug: string }>> = {};
    private taxonomyToAttribute: Record<string, ProductAttribute> = {};
    private nameToTaxonomy: Record<string, string> = {};

    constructor(private product: VariableProduct) {
        this.buildIndex();
    }

    private buildIndex() {
        const attributes: ProductAttribute[] = this.product.attributes ?? [];
        const variations: VariationAny[] = (this.product.variations ?? []) as VariationAny[];

        // taxonomy => terms
        this.attributeMap = attributes
            .filter(a => a.has_variations)
            .reduce<Record<string, ProductAttributeTerm[]>>((acc, a) => {
                acc[a.taxonomy] = a.terms;
                return acc;
            }, {});

        // label/name lookups
        for (const a of attributes) {
            this.taxonomyToAttribute[a.taxonomy] = a;
            this.nameToTaxonomy[norm(a.name)] = a.taxonomy;
        }

        // build variation maps
        for (const v of variations) {
            const termsForThisVariation: Array<{ taxonomy: string; slug: string }> = [];

            for (const attr of v.attributes ?? []) {
                const taxonomy = this.nameToTaxonomy[norm(attr.name)] ?? norm(attr.name);
                const raw = attr.value ?? attr.option ?? '';
                const slug = norm(raw);
                if (!taxonomy || !slug) continue;

                if (!this.variationByAttribute[taxonomy]) this.variationByAttribute[taxonomy] = {};
                if (!this.variationByAttribute[taxonomy][slug]) this.variationByAttribute[taxonomy][slug] = [];
                this.variationByAttribute[taxonomy][slug].push(v.id);

                termsForThisVariation.push({ taxonomy, slug });
            }

            this.variationIdToTerms[v.id] = termsForThisVariation;
        }
    }

    /** One option-group per attribute; each option links variationId + the “other” term (self filtered out). */
    getOptionGroups(): OptionGroup[] {
        const groups: OptionGroup[] = [];

        for (const taxonomy of Object.keys(this.attributeMap)) {
            const attribute = this.taxonomyToAttribute[taxonomy];
            if (!attribute) continue;

            const options: Option[] = (this.attributeMap[taxonomy] ?? []).map(term => {
                const slug = norm(term.slug);
                const variationIds = this.variationByAttribute[taxonomy]?.[slug] ?? [];

                const linked: Linked[] = variationIds.map(variationId => {
                    const allTerms = this.variationIdToTerms[variationId] ?? [];
                    const other = allTerms.find(t => t.taxonomy !== taxonomy) ?? null;
                    return { variationId, term: other };
                });

                return { slug, label: term.name, linked };
            });

            groups.push({
                attributeId: attribute.id,
                taxonomy,
                label: attribute.name,
                options,
            });
        }

        return groups;
    }

    // (optional) expose raw maps if you need them elsewhere
    get debug() {
        return {
            attributeMap: this.attributeMap,
            variationByAttribute: this.variationByAttribute,
            variationIdToTerms: this.variationIdToTerms,
        };
    }
}
