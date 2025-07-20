export class ProductAttributeOption {
  name: string;
  isAvailable: boolean;

  constructor(name: string) {
    this.name = name;
    this.isAvailable = true;
  }

  get label(): string {
    if (!this.name) return '';
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
}
