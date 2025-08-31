import { readFixture } from "tests/product/helpers";

import { Product, RawProduct } from "@/domain/product/Product";

test("customFields are normalized from extensions.app_fpf.fields", () => {
  const raw = readFixture<RawProduct>("fpf_extended.json");
  const p = Product.fromRaw(raw);

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
