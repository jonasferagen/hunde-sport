// domain/custom-fields/CustomField.ts
import { cleanHtml } from "@/lib/format";

interface ICustomField {
  key: string;
  label: string;
  required: boolean;
  maxlen: number;
  lines: number;
}

export type CustomFieldData = {
  key?: string;
  label?: string;
  required?: boolean;
  maxlen?: number;
  lines?: number;
};

export class CustomField implements ICustomField {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
  readonly maxlen: number;
  readonly lines: number;

  private constructor(data: ICustomField) {
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

  get isSingleLine(): boolean {
    return this.lines <= 1;
  }

  validate(value: unknown): string | null {
    const s = typeof value === "string" ? value : "";
    if (this.required && s.trim().length === 0) return "Påkrevd";
    if (this.maxlen > 0 && s.length > this.maxlen)
      return `Maks ${this.maxlen} tegn`;
    return null;
  }
}
