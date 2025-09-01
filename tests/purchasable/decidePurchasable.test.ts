// tests/purchasable/decidePurchasable.behavior.test.ts

import {
  decidePurchasable,
  type PurchasableStatus,
} from "@/domain/Purchasable";

function D(key: PurchasableStatus, label = "Label") {
  const purch = { status: { key, label } } as any; // minimal shape
  return decidePurchasable(purch);
}

describe("decidePurchasable (behavioral)", () => {
  test.each<
    [
      key: PurchasableStatus,
      expectedNext: "addToCart" | "openVariations" | "openCustomize" | "noop",
      expectedDisabled: boolean,
    ]
  >([
    ["ready", "addToCart", false],
    ["select", "openVariations", false],
    ["customize", "openCustomize", false],
    ["select_incomplete", "noop", true],
    ["customize_incomplete", "noop", true],
    ["sold_out", "noop", true],
    ["unavailable", "noop", true],
  ])("%s → %s (disabled=%s)", (key, expectedNext, expectedDisabled) => {
    const d = D(key);
    expect(d.next).toBe(expectedNext);
    expect(d.disabled).toBe(expectedDisabled);
    expect(d.label).toBe("Label");
  });
});
