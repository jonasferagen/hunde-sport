// domain/custom-fields/CustomField.ts
import { cleanHtml } from "@/lib/format";

export interface RawCustomField {
  key?: string;
  label?: string;
  required?: boolean;
  maxlen?: number;
  lines?: number;
}

export interface CustomFieldData {
  key: string;
  label: string;
  required: boolean;
  maxlen: number;
  lines: number;
}

export class CustomField implements CustomFieldData {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
  readonly maxlen: number;
  readonly lines: number;

  private constructor(data: CustomFieldData) {
    this.key = data.key;
    this.label = cleanHtml(data.label || data.key);
    this.required = data.required;
    this.maxlen = data.maxlen;
    this.lines = data.lines;
  }

  static fromRawList(raw: unknown): CustomField[] {
    if (!Array.isArray(raw)) return [];
    const out: CustomField[] = [];
    for (const item of raw as RawCustomField[]) {
      if (!item?.key) continue;
      out.push(
        new CustomField({
          key: String(item.key),
          label: typeof item.label === "string" ? item.label : String(item.key),
          required: !!item.required,
          maxlen: typeof item.maxlen === "number" ? item.maxlen : 40,
          lines: typeof item.lines === "number" ? item.lines : 1,
        })
      );
    }
    return out;
  }
}
