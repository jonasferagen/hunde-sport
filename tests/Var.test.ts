import * as fs from "fs";
import * as util from "util";

import { mapToProduct, Product } from "@/domain/Product/Product";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { getProductPriceRange } from "@/types";

import { ProductVariationCollection } from "../domain/Product/helpers/ProductVariationCollection";
import { ProductAttributeHelper } from "../domain/Product/ProductAttributeHelper";

const raw1 = fs.readFileSync("tests/main.json", "utf-8");
const variableProduct = mapToProduct(JSON.parse(raw1));

console.log(variableProduct);
const opts = new ProductAttributeHelper(variableProduct);

console.log(
  util.inspect(opts.getOptionGroups(), {
    depth: null,
    colors: true,
    compact: false,
  })
);

const raw2 = fs.readFileSync("tests/variations.json", "utf-8");
const variations = JSON.parse(raw2);

let items: any[] = [];
for (const variation of variations) {
  items.push(mapToProduct(variation));
}

console.log(items[0].availability);

const variationCollection = new ProductVariationCollection(items);

const groups = opts.getOptionGroups();
const sizeGroup = groups.find((g) => g.taxonomy === "pa_storrelse");
if (sizeGroup) {
  const xl = sizeGroup.options.find((o) => o.slug === "xl");
  if (xl) {
    const range = variationCollection.priceRangeForOption(xl);
    console.log("XL price range:", range);
  }
}

it("builds maps correctly", () => {
  expect(true).toBe(true);
});
