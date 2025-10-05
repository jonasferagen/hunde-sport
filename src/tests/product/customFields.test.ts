import { Product } from "@/domain/product/Product";

import { loadFixture } from "./helpers";

test("customFields are normalized from extensions.app_fpf.fields", () => {
  const raw = loadFixture("customtext.json");
  const p = Product.create(raw);

  expect(p.hasCustomFields).toBe(true);
  expect(p.customFields.length).toBeGreaterThan(0);
  const f = p.customFields[0]!;
  expect(f).toEqual(
    expect.objectContaining({
      key: expect.any(String),
      label: expect.any(String),
      required: expect.any(Boolean),
      maxlen: expect.any(Number),
      lines: expect.any(Number),
    })
  );
});
