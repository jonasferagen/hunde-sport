// lib/ProductVariationOptions.ts
import * as fs from "fs";

// --- Input types (from your JSON / domain) ---
type AttributeTerm = { id: number; name: string; slug: string };
type Attribute = {
    id: number;
    name: string;         // display label, e.g. "Størrelse"
    taxonomy: string;     // e.g. "pa_storrelse"
    has_variations: boolean;
    terms: AttributeTerm[];
};

type VariationAttribute = { name: string; value: string }; // name = Attribute.name, value = term slug
export type ProductVariation = { id: number; attributes: VariationAttribute[] };

const norm = (s: string) => s.trim().toLowerCase();

// --- UI-facing types ---
export type Linked = {
    variationId: number;
    term: { taxonomy: string; slug: string } | null; // "other" term only
};

export type Option = {
    slug: string;        // term slug (e.g., "xl")
    label: string;       // term display name (e.g., "XL")
    linked: Linked[];    // pairs variationId with the other term
};

export type OptionGroup = {
    attributeId: number;
    taxonomy: string;    // e.g., "pa_storrelse"
    label: string;       // e.g., "Størrelse"
    options: Option[];
};

// --- Builder for UI option groups ---
export class ProductVariationOptions {
    attributeMap: Record<string, AttributeTerm[]> = {};
    variationByAttribute: Record<string, Record<string, number[]>> = {};
    variationIdToTerms: Record<number, Array<{ taxonomy: string; slug: string }>> = {};

    private taxonomyToAttribute: Record<string, Attribute> = {};
    private nameToTaxonomy: Record<string, string> = {};

    constructor(private attributes: Attribute[], private variations: ProductVariation[]) {
        this.buildIndex();
    }

    private buildIndex() {
        // taxonomy => terms
        this.attributeMap = this.attributes
            .filter(a => a.has_variations)
            .reduce<Record<string, AttributeTerm[]>>((acc, a) => {
                acc[a.taxonomy] = a.terms;
                return acc;
            }, {});

        for (const a of this.attributes) {
            this.taxonomyToAttribute[a.taxonomy] = a;
            this.nameToTaxonomy[norm(a.name)] = a.taxonomy;
        }

        // Build: variationByAttribute + variationIdToTerms
        for (const v of this.variations) {
            const termsForThisVariation: Array<{ taxonomy: string; slug: string }> = [];

            for (const attr of v.attributes) {
                const taxonomy = this.nameToTaxonomy[norm(attr.name)] ?? norm(attr.name);
                const slug = norm(attr.value);

                if (!this.variationByAttribute[taxonomy]) this.variationByAttribute[taxonomy] = {};
                if (!this.variationByAttribute[taxonomy][slug]) this.variationByAttribute[taxonomy][slug] = [];
                this.variationByAttribute[taxonomy][slug].push(v.id);

                termsForThisVariation.push({ taxonomy, slug });
            }

            this.variationIdToTerms[v.id] = termsForThisVariation;
        }
    }

    /** One option-group per attribute; each option links to variationId + other-term */
    getOptionGroups(): OptionGroup[] {
        const groups: OptionGroup[] = [];

        for (const taxonomy of Object.keys(this.attributeMap)) {
            const attribute = this.taxonomyToAttribute[taxonomy];
            if (!attribute) continue;

            const terms = this.attributeMap[taxonomy] ?? [];

            const options: Option[] = terms.map(term => {
                const slug = norm(term.slug);
                const variationIds = this.variationByAttribute[taxonomy]?.[slug] ?? [];

                const linked: Linked[] = variationIds.map(variationId => {
                    const allTerms = this.variationIdToTerms[variationId] ?? [];
                    const other = allTerms.find(t => t.taxonomy !== taxonomy) ?? null; // exclude self
                    return { variationId, term: other };
                });

                return {
                    slug,
                    label: term.name,
                    linked,
                };
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

    printResults() {
        console.log("optionGroups:", JSON.stringify(this.getOptionGroups(), null, 2));
    }
}

// Helper for standalone runs/tests
export function loadOptionsFromJson(path: string): ProductVariationOptions {
    const raw = fs.readFileSync(path, "utf-8");
    const data = JSON.parse(raw);
    return new ProductVariationOptions(data.attributes, data.variations);
}
