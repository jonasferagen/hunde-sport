import {
  decidePurchasable,
  type UIByStatus,
} from "@/domain/purchasable/decidePurchasable";

const UI: UIByStatus = {
  ready: { iconKey: "ShoppingCart", theme: "cta.buy" },
  select: { iconKey: "Boxes", theme: "cta.view" },
  select_incomplete: { iconKey: "TriangleAlert", theme: "cta.select" },
  customize: { iconKey: "Brush", theme: "cta.view" },
  customize_incomplete: { iconKey: "TriangleAlert", theme: "cta.select" },
  sold_out: { iconKey: "CircleAlert", theme: "cta.oos" },
  unavailable: { iconKey: "XCircle", theme: "cta.unavailable" },
};

const D = (k: any) => decidePurchasable(k, "Label", UI);

test("ready → addToCart, enabled", () => {
  const d = D("ready");
  expect(d.next).toBe("addToCart");
  expect(d.disabled).toBe(false);
  expect(d.label).toBe("Label");
  expect(d.iconKey).toBe("ShoppingCart");
});

test("select → openVariations", () => {
  const d = D("select");
  expect(d.next).toBe("openVariations");
  expect(d.disabled).toBe(false);
  expect(d.iconKey).toBe("Boxes");
});

test("customize → openCustomize", () => {
  const d = D("customize");
  expect(d.next).toBe("openCustomize");
  expect(d.disabled).toBe(false);
  expect(d.iconKey).toBe("Brush");
});

test("select_incomplete → noop (disabled)", () => {
  const d = D("select_incomplete");
  expect(d.next).toBe("noop");
  expect(d.disabled).toBe(true);
  expect(d.iconKey).toBe("TriangleAlert");
});

test("customize_incomplete → noop (disabled)", () => {
  const d = D("customize_incomplete");
  expect(d.next).toBe("noop");
  expect(d.disabled).toBe(true);
  expect(d.iconKey).toBe("TriangleAlert");
});

test("sold_out → noop (disabled)", () => {
  const d = D("sold_out");
  expect(d.next).toBe("noop");
  expect(d.disabled).toBe(true);
  expect(d.iconKey).toBe("CircleAlert");
});

test("unavailable → noop (disabled)", () => {
  const d = D("unavailable");
  expect(d.next).toBe("noop");
  expect(d.disabled).toBe(true);
  expect(d.iconKey).toBe("XCircle");
});
