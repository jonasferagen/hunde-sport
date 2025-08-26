import * as fs from "fs";

type Term = { id: number; name: string; slug: string };
type Attribute = {
    id: number;
    name: string;
    taxonomy: string;
    has_variations: boolean;
    terms: Term[];
};

type VariationAttribute = { name: string; value: string };
type Variation = { id: number; attributes: VariationAttribute[] };

const norm = (s: string) => s.trim().toLowerCase();

export class Variations {
    attributeMap: Record<string, Term[]> = {};
    variationByAttribute: Record<string, Record<string, number[]>> = {};
    variationIdToTerms: Record<number, Array<{ taxonomy: string; slug: string }>> = {};

    constructor(private attributes: Attribute[], private variations: Variation[]) {
        this.buildIndex();
    }

    private buildIndex() {
        // taxonomy => terms
        this.attributeMap = this.attributes
            .filter(a => a.has_variations)
            .reduce<Record<string, Term[]>>((acc, a) => {
                acc[a.taxonomy] = a.terms;
                return acc;
            }, {});

        // name -> taxonomy
        const nameToTaxonomy: Record<string, string> = this.attributes.reduce((acc, a) => {
            acc[norm(a.name)] = a.taxonomy;
            return acc;
        }, {} as Record<string, string>);

        // build maps
        for (const v of this.variations) {
            const termsForThisVariation: Array<{ taxonomy: string; slug: string }> = [];

            for (const attr of v.attributes) {
                const taxonomy = nameToTaxonomy[norm(attr.name)] ?? norm(attr.name);
                const slug = norm(attr.value);

                if (!this.variationByAttribute[taxonomy]) this.variationByAttribute[taxonomy] = {};
                if (!this.variationByAttribute[taxonomy][slug]) this.variationByAttribute[taxonomy][slug] = [];
                this.variationByAttribute[taxonomy][slug].push(v.id);

                termsForThisVariation.push({ taxonomy, slug });
            }

            this.variationIdToTerms[v.id] = termsForThisVariation;
        }
    }

    printResults() {
        console.log("attributeMap:", this.attributeMap);
        console.log("variationByAttribute:", this.variationByAttribute);
        console.log("variationIdToTerms:", this.variationIdToTerms);
    }
}

// helper for test
export function loadFromJson(path: string): Variations {
    const raw = fs.readFileSync(path, "utf-8");
    const data = JSON.parse(raw);
    return new Variations(data.attributes, data.variations);
}
