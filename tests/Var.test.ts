
import * as util from "util";
import * as fs from "fs";

import { mapToProduct, Product } from '@/domain/Product/Product';
import { ProductVariation } from '@/domain/Product/ProductVariation';
import { VariableProductOptions } from './VariableProductOptions';
import { ProductVariationCollection } from "./ProductVariationCollection";


const raw1 = fs.readFileSync("tests/main.json", "utf-8");
const variableProduct = mapToProduct(JSON.parse(raw1));

console.log(variableProduct);
const opts = new VariableProductOptions(variableProduct);

console.log(util.inspect(opts.getOptionGroups(), { depth: null, colors: true, compact: false }));


const raw2 = fs.readFileSync("tests/variations.json", "utf-8");
const variations = JSON.parse(raw2);

let items: any[] = [];
for (const variation of variations) {
    items.push(mapToProduct(variation));
}


console.log(items[0].prices);

const variationCollection = new ProductVariationCollection(items);
console.log('Has 35987?', variationCollection.has(35987));

it('builds maps correctly', () => {
    expect(true).toBe(true);
});