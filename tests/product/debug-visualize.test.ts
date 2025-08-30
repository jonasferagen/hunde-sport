// tests/variable/debug-visualize.test.ts

import fs from "fs";
import path from "path";

import { Product } from "@/domain/product/Product";
import { VariableProduct } from "@/domain/product/VariableProduct";

it("visualizes attributes / terms / variants", () => {
  const file = path.join(__dirname, "data", "variable.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const p = Product.fromRaw(raw);

  expect(p).toBeInstanceOf(VariableProduct);
  if (!(p instanceof VariableProduct)) return;

  const attributes = Object.fromEntries(p.attributes.entries());
  const terms = Object.fromEntries(p.terms.entries());
  const variants = p.variations;

  // prettier print

  //  console.log(JSON.stringify({ attributes, terms, variants }, null, 2));
});
