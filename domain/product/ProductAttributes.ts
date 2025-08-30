/** ---- Normalized domain types ---- */
export type Attribute = {
  key: string; // normalized display name, e.g. "farge"
  label: string; // e.g. "Farge"
  taxonomy: string;
  has_variations: boolean;
};

export type Term = {
  key: string; // slug, e.g. "karamell"
  label: string; // e.g. "Karamell"
  attribute: string; // normalized attribute key, e.g. "farge"
};

export type Variation = {
  key: number; // variation id
  options: { term: string; attribute: string }[];
};
