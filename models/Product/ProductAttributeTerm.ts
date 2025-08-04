export interface ProductAttributeTermData {
    id: number;
    name: string;
    slug: string;
    default?: boolean;
}

export class ProductAttributeTerm {
    id: number;
    name: string;
    slug: string;
    isDefault: boolean;

    constructor(data: ProductAttributeTermData) {
        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.isDefault = data.default || false;
    }
}
