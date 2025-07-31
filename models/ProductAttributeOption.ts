export class ProductAttributeOption {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  get label(): string {
    if (!this.name) return '';
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
}
