import { BaseProduct, BaseProductData } from './BaseProduct';

export interface SimpleProductData extends BaseProductData { }

export class SimpleProduct extends BaseProduct<SimpleProductData> {
    constructor(data: SimpleProductData) {
        if (data.type !== 'simple') {
            throw new Error('Cannot construct SimpleProduct with type other than "simple".');
        }
        super(data);
    }


}
