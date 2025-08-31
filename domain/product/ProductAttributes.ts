/** ---- Normalized domain types ---- */
export interface Attribute {
  key: string; // normalized display name, e.g. "farge"
  label: string; // e.g. "Farge"
  taxonomy: string;
  has_variations: boolean;
}
export interface Term {
  key: string; // slug, e.g. "karamell"
  label: string; // e.g. "Karamell"
  attribute: string; // normalized attribute key, e.g. "farge"
}

export interface Variation {
  key: number; // variation id
  options: { term: string; attribute: string }[];
}

export type AttributeData = {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: TermData[];
};

export type TermData = { id: number; name: string; slug: string };

export type VariationData = {
  id: number;
  attributes: { name: string; value: string }[];
};
