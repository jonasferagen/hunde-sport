// domain/Product/VariableProduct.ts
import { capitalize, cleanHtml } from "@/lib/format";

import { BaseProduct, BaseProductData } from "./BaseProduct";

type RawAttributeTerm = { id: number; name: string; slug: string };
export type RawAttribute = {
  id: number;
  name: string; // e.g. "Farge", "Størrelse"
  taxonomy: string; // e.g. "pa_farge", "pa_storrelse"
  has_variations: boolean;
  terms: RawAttributeTerm[];
};

export type RawVariationRef = {
  id: number; // variation id
  attributes: { name: string; value: string }[];
};

export interface VariableProductData extends BaseProductData {
  type: "variable";
  parent: 0;
  attributes: RawAttribute[];
  variations: RawVariationRef[];
}

// Internal helpers/types
const norm = (s?: string) =>
  String(s ?? "")
    .trim()
    .toLowerCase();

type Attribute = {
  key: string; // normalized display name, e.g. "farge"
  label: string; // e.g. "Farge"
  taxonomy: string; // taxonomy code, e.g. "pa_farge"
  has_variations: boolean;
};

type Term = {
  key: string; // slug, e.g. "karamell"
  label: string; // e.g. "Karamell"
  attribute: string; // attribute key (normalized), e.g. "farge"
};

type Variant = {
  key: number; // variation id
  options: { term: string; attribute: string }[];
};

export class VariableProduct extends BaseProduct {
  readonly rawAttributes: RawAttribute[];
  readonly rawVariations: RawVariationRef[];

  constructor(data: VariableProductData) {
    if (data.type !== "variable") {
      throw new Error("Invalid data type for VariableProduct");
    }
    super(data);
    this.rawAttributes = data.attributes ?? [];
    this.rawVariations = data.variations ?? [];
  }

  /**
   * Map of attributeKey (normalized display name) → Attribute
   * - key: norm(cleanHtml(name)) e.g. "farge"
   * - label: capitalize(cleanHtml(name)) e.g. "Farge"
   * - taxonomy: raw taxonomy code e.g. "pa_farge"
   */
  get attributes(): Map<string, Attribute> {
    return new Map(
      this.rawAttributes.map((a) => {
        const display = cleanHtml(a.name);
        const key = norm(display);
        return [
          key,
          {
            key,
            label: capitalize(display),
            taxonomy: a.taxonomy,
            has_variations: a.has_variations,
          },
        ] as const;
      })
    );
  }

  /**
   * Map of termSlug → Term
   * - attribute points to the attribute key (normalized display name)
   */
  get terms(): Map<string, Term> {
    const out: [string, Term][] = [];
    for (const attr of this.rawAttributes) {
      const attrKey = norm(cleanHtml(attr.name));
      for (const t of attr.terms) {
        out.push([
          t.slug,
          {
            key: t.slug,
            label: capitalize(cleanHtml(t.name)),
            attribute: attrKey,
          },
        ]);
      }
    }
    return new Map(out);
  }

  /**
   * Variants normalized:
   * - looks up attribute by normalized name from variation refs
   * - links term by slug
   */
  get variants(): Variant[] {
    const attributes = this.attributes;
    const terms = this.terms;

    return this.rawVariations.map((v) => ({
      key: v.id,
      options: v.attributes.map(({ name, value }) => {
        const attrKey = norm(cleanHtml(name)); // e.g. "farge", "størrelse"
        if (!attributes.has(attrKey)) {
          throw new Error(
            `Unknown attribute key in variation: ${name} -> ${attrKey}`
          );
        }
        const term = terms.get(value);
        if (!term) {
          throw new Error(`Unknown term slug in variation: ${value}`);
        }
        return {
          term: term.key, // slug
          attribute: attrKey, // normalized attribute key
        };
      }),
    }));
  }
}
