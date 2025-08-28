// tests/variable/debug-visualize.test.ts

import fs from "fs";
import path from "path";

import { VariableProduct } from "@/domain/Product/VariableProduct";
import { mapToProduct } from "@/mappers/mapToProduct";

it("visualizes attributes / terms / variants", () => {
  const file = path.join(__dirname, "data", "variable.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const p = mapToProduct(raw);

  expect(p).toBeInstanceOf(VariableProduct);
  if (!(p instanceof VariableProduct)) return;

  const attributes = Object.fromEntries(p.attributes.entries());
  const terms = Object.fromEntries(p.terms.entries());
  const variants = p.variants;

  // prettier print

  //  console.log(JSON.stringify({ attributes, terms, variants }, null, 2));
});
