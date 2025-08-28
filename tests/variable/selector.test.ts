import fs from "fs";
import path from "path";

import { VariationSelector } from "@/domain/Product/helpers/VariationSelector";
import { mapToProduct } from "@/domain/Product/mapToProduct";
import { VariableProduct } from "@/domain/Product/VariableProduct";

const fixture = path.join(__dirname, "data", "variable.json");

// Utility: try to find a selection resolving to a single variant id.
// Returns { attrA, termA, attrB, termB, id } or null.
function findResolvablePair(selector: VariationSelector) {
  const all = selector.getAllAttributeOptions();
  if (all.length < 2) return null;

  const [a, b] = all;

  // Try every enabled term in attr A, then every enabled term in attr B
  for (const optA of a.options.filter((o) => o.enabled)) {
    selector.select(a.attribute.key, optA.term.key);
    for (const optB of b.options.filter((o) => o.enabled)) {
      selector.select(b.attribute.key, optB.term.key);
      const id = selector.getSelectedVariationId();
      if (id !== undefined) {
        return {
          attrA: a.attribute.key,
          termA: optA.term.key,
          attrB: b.attribute.key,
          termB: optB.term.key,
          id,
        };
      }
    }
    // reset B between attempts
    selector.select(b.attribute.key, null);
  }

  // reset A before returning
  selector.select(a.attribute.key, null);
  return null;
}

describe("VariationSelector", () => {
  it("produces option lists per attribute with enabled flags and variationIds", () => {
    const raw = JSON.parse(fs.readFileSync(fixture, "utf8"));
    const product = mapToProduct(raw);

    expect(product).toBeInstanceOf(VariableProduct);
    if (!(product instanceof VariableProduct)) return;

    const selector = new VariationSelector(product);
    const all = selector.getAllAttributeOptions();

    // usually 1–2 attributes; we don't hardcode the exact count
    expect(all.length).toBeGreaterThan(0);

    for (const group of all) {
      expect(typeof group.attribute.key).toBe("string");
      expect(typeof group.attribute.label).toBe("string");
      expect(Array.isArray(group.options)).toBe(true);
      expect(group.options.length).toBeGreaterThan(0);

      for (const opt of group.options) {
        expect(typeof opt.term.key).toBe("string");
        expect(typeof opt.term.label).toBe("string");
        expect(typeof opt.term.attribute).toBe("string");
        expect(typeof opt.enabled).toBe("boolean");
        expect(Array.isArray(opt.variationIds)).toBe(true);
        // if enabled, it must have at least one variation id
        if (opt.enabled) {
          expect(opt.variationIds.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("narrows variant candidates as selections are made and resolves to a single variation when possible", () => {
    const raw = JSON.parse(fs.readFileSync(fixture, "utf8"));
    const product = mapToProduct(raw);

    expect(product).toBeInstanceOf(VariableProduct);
    if (!(product instanceof VariableProduct)) return;

    const selector = new VariationSelector(product);
    const all = selector.getAllAttributeOptions();

    // No selection: candidate set should be all variation ids
    const allIds = product.variants.map((v) => v.key).sort((a, b) => a - b);
    const noSelIds = selector.getCurrentVariantIds().sort((a, b) => a - b);
    expect(noSelIds).toEqual(allIds);

    // If only one attribute exists, picking any enabled term should narrow (possibly to 1)
    if (all.length === 1) {
      const attr = all[0];
      const enabledOpt = attr.options.find((o) => o.enabled);
      if (enabledOpt) {
        selector.select(attr.attribute.key, enabledOpt.term.key);
        const ids = selector.getCurrentVariantIds();
        expect(ids.length).toBeGreaterThan(0);
      }
      return;
    }

    // Two attributes: pick an enabled option in the first attribute
    const [a, b] = all;
    const optA = a.options.find((o) => o.enabled);
    if (!optA) return; // if none enabled, nothing to assert beyond here

    selector.select(a.attribute.key, optA.term.key);
    const idsAfterA = selector.getCurrentVariantIds();
    expect(idsAfterA.length).toBeGreaterThan(0);

    // Now try to find a B option that resolves to a single id
    const resolved = findResolvablePair(selector);
    if (resolved) {
      // sanity: our recorded selection should still yield that exact id
      selector.select(resolved.attrA, resolved.termA);
      selector.select(resolved.attrB, resolved.termB);
      expect(selector.getSelectedVariationId()).toBe(resolved.id);
    } else {
      // If no pair leads to a single id, at least ensure intersections are consistent:
      // For every enabled B option, the intersection shouldn't introduce ids outside each option's variationIds.
      for (const optB of b.options.filter((o) => o.enabled)) {
        selector.select(b.attribute.key, optB.term.key);
        const ids = selector.getCurrentVariantIds();
        // ids should be subset of optA.variationIds ∩ optB.variationIds
        const allowed = intersect(
          new Set(optA.variationIds),
          new Set(optB.variationIds)
        );
        ids.forEach((id) => expect(allowed.has(id)).toBe(true));
      }
    }
  });
});

// local helper
function intersect(a: Set<number>, b: Set<number>) {
  const out = new Set<number>();
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) out.add(x);
  return out;
}
