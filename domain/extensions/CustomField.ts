// domain/extensions/CustomField.ts
import { cleanHtml } from "@/lib/format";

type NormalizedCustomField = {
  key: string;
  label: string;
  required: boolean;
  maxlen: number;
  lines: number;
};

export type CustomFieldData = {
  key?: string;
  label?: string;
  required?: boolean;
  maxlen?: number;
  lines?: number;
};

export class CustomField implements NormalizedCustomField {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
  readonly maxlen: number;
  readonly lines: number;

  private constructor(data: NormalizedCustomField) {
    this.key = data.key;
    this.label = cleanHtml(data.label || data.key);
    this.required = data.required;
    this.maxlen = data.maxlen;
    this.lines = data.lines;
  }

  static create(raw: CustomFieldData): CustomField {
    return new CustomField({
      key: String(raw.key),
      label: typeof raw.label === "string" ? raw.label : String(raw.key),
      required: !!raw.required,
      maxlen: typeof raw.maxlen === "number" ? raw.maxlen : 40,
      lines: typeof raw.lines === "number" ? raw.lines : 1,
    });
  }

  static toCartExtensions(values?: Record<string, string>) {
    if (!values) return undefined;

    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(values)) {
      if (typeof v === "string") {
        const t = v.trim();
        if (t.length > 0) cleaned[k] = t;
      }
    }

    if (Object.keys(cleaned).length === 0) return undefined;

    return { extensions: { app_fpf: { values: cleaned } } };
  }
}
