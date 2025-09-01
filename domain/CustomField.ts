// domain/extensions/CustomField.ts
import { cleanHtml } from "@/lib/format";

type NormalizedCustomField = {
  key: string;
  label: string;
  required: boolean;
  maxlen: number;
  lines: number;
  value: string;
};

export type CustomFieldData = {
  key?: string;
  label?: string;
  required?: boolean;
  maxlen?: number;
  lines?: number;
  value?: string;
};

export class CustomField implements NormalizedCustomField {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
  readonly maxlen: number;
  readonly lines: number;

  value: string;

  private constructor(data: NormalizedCustomField) {
    this.key = data.key;
    this.label = cleanHtml(data.label || data.key);
    this.required = data.required;
    this.maxlen = data.maxlen;
    this.lines = data.lines;
    this.value = data.value;
  }

  static create(raw: CustomFieldData): CustomField {
    return new CustomField({
      key: String(raw.key),
      label: typeof raw.label === "string" ? raw.label : String(raw.key),
      required: !!raw.required,
      maxlen: typeof raw.maxlen === "number" ? raw.maxlen : 40,
      lines: typeof raw.lines === "number" ? raw.lines : 1,
      value: "",
    });
  }

  /** Mutable setter (practical for simple forms) */
  setValue(next: string): this {
    this.value = typeof next === "string" ? next.slice(0, this.maxlen) : "";
    return this;
  }

  static toCartExtensions(fields: CustomField[] | undefined) {
    if (!fields || fields.length === 0) return undefined;

    const cleaned: Record<string, string> = {};
    for (const f of fields) {
      const t = (f.value ?? "").trim();
      if (t.length > 0) cleaned[f.key] = t;
    }
    if (Object.keys(cleaned).length === 0) return undefined;

    return { extensions: { app_fpf: { values: cleaned } } };
  }
}

// ------- WC shapes (adapter-only types)
export type FpfValues = Record<string, string>;
type LineItemLike = {
  extensions?: {
    app_fpf?: { values?: FpfValues | Record<string, never> } | null;
  } | null;
};

export const getFpfValuesFromLineItem = (
  lineItem: LineItemLike | null | undefined
): FpfValues | undefined => {
  const vals = lineItem?.extensions?.app_fpf?.values;
  return vals && Object.keys(vals).length > 0 ? (vals as FpfValues) : undefined;
};

export const hasAnyFpfValues = (
  lineItem: LineItemLike | null | undefined
): boolean => !!getFpfValuesFromLineItem(lineItem);
