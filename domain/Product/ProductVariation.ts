
import { BaseProduct, BaseProductData } from "./BaseProduct";

export class ProductVariation extends BaseProduct<BaseProductData> {
    readonly type: 'variation' = 'variation';
    constructor(data: BaseProductData) {
        if (data.type !== 'variation') {
            throw new Error('Cannot construct ProductVariation with type other than "variation".');
        }
        super(data);
    }

    getParsedVariation(): { name: string; value: string }[] {
        if (!this.variation) {
            return [];
        }

        return this.variation
            .split(',')
            .map((pair) => {
                const [attribute, value] = pair.split(':');
                if (!attribute || !value) {
                    return null;
                }
                return {
                    name: attribute.trim(),
                    value: value.trim(),
                };
            })
            .filter((v): v is { name: string; value: string } => v !== null);
    }
    getLabel(): string {
        return this.getParsedVariation().map((v) => v.value).join(', ');
    }
}
