import { VariableProduct } from "@/domain/product/VariableProduct";

import data from "./data/variable.json";
describe("VariableProduct set-based lookups", () => {
  const vp = VariableProduct.fromRaw(data as any);

  test("variationIdSet matches source variations", () => {
    const sourceIds = new Set((data as any).variations.map((v: any) => v.id));
    expect(vp.variationIdSet.size).toBe(sourceIds.size);
    for (const id of sourceIds) {
      expect(vp.variationIdSet.has(id as number)).toBe(true);
    }
    // order getter still matches underlying json order
    expect(vp.variationIds).toEqual(
      (data as any).variations.map((v: any) => v.id)
    );
  });

  test("getVariationSetForTerm returns subsets of variationIdSet", () => {
    // collect some term slugs from the JSON directly
    const someTermSlugs: string[] = [];
    for (const attr of (data as any).attributes ?? []) {
      for (const t of attr.terms ?? []) {
        someTermSlugs.push(t.slug);
        if (someTermSlugs.length >= 8) break;
      }
      if (someTermSlugs.length >= 8) break;
    }

    for (const slug of someTermSlugs) {
      const set = vp.getVariationSetForTerm(slug);
      for (const id of set) {
        expect(vp.variationIdSet.has(id)).toBe(true);
      }
    }
  });

  test("getVariationSetForAttribute equals the union of its term sets (store order)", () => {
    for (const attrKey of vp.attributeOrder) {
      const byMethod = vp.getVariationSetForAttribute(attrKey);
      const slugs = vp.getTermOrder(attrKey);

      const union = new Set<number>();
      for (const slug of slugs) {
        const s = vp.getVariationSetForTerm(slug);
        for (const id of s) union.add(id);
      }

      // sizes match
      expect(byMethod.size).toBe(union.size);
      // content matches
      for (const id of union) expect(byMethod.has(id)).toBe(true);
    }
  });

  test("getVariationId resolves a complete selection to the unique id", () => {
    console.warn("duplicate variant:rosa-gra,xss:31189:34739");

    // pick one normalized variation from the model
    const firstVar = vp.variations[0];
    expect(firstVar).toBeTruthy();

    // Build slugs aligned with the model order
    const termSlugsInOrder = vp.attributeOrder.map((attrKey) => {
      const opt = firstVar.options.find((o) => o.attribute === attrKey);
      expect(opt).toBeTruthy();
      return opt!.term;
    });

    // Compute intersection size for this combo
    const perTermSets = termSlugsInOrder.map((slug) =>
      vp.getVariationSetForTerm(slug)
    );
    const intersection = perTermSets.reduce(
      (acc, s) => {
        if (!acc) return s;
        const out = new Set<number>();
        for (const id of acc) if (s.has(id)) out.add(id);
        return out;
      },
      null as ReadonlySet<number> | null
    )!;

    const resolvedId = vp.getVariationId(termSlugsInOrder);

    if (intersection.size === 1) {
      // unique combo → should resolve to that id
      const onlyId = intersection.values().next().value as number;
      expect(resolvedId).toBe(onlyId);
    } else {
      // non-unique combo (duplicate variations share same terms) → undefined by design
      expect(resolvedId).toBeUndefined();
      // and the chosen firstVar.key should be in the ambiguous intersection
      expect(intersection.has(firstVar.key)).toBe(true);
    }
  });

  test("intersections via getVariationId require completeness and uniqueness", () => {
    // Incomplete selection (one term missing) → undefined
    if (vp.attributeOrder.length >= 2) {
      const firstVar = (data as any).variations?.[0];
      const termByAttr = new Map<string, string>();
      for (const { name, value } of firstVar.attributes ?? []) {
        termByAttr.set(String(name).toLocaleLowerCase(), value);
      }

      const partial = vp.attributeOrder
        .slice(0, vp.attributeOrder.length - 1)
        .map((a) => termByAttr.get(a)!)
        .filter(Boolean);

      // ensure it's actually partial
      expect(partial.length).toBeLessThan(vp.attributeOrder.length);

      const id = vp.getVariationId(partial as any);
      expect(id).toBeUndefined();
    }

    // Ambiguous selection (if two different variations share same subset) → undefined
    // We build this defensively: pick first two variations that share at least one attr term.
    const vars: any[] = (data as any).variations ?? [];
    if (vars.length >= 2) {
      const v0 = vars[0];
      const v1 = vars.find((vv) => vv !== v0);
      if (v1) {
        const common: string[] = [];
        for (const a0 of v0.attributes ?? []) {
          const hit = (v1.attributes ?? []).find(
            (a1: any) =>
              String(a1.name).toLocaleLowerCase() ===
                String(a0.name).toLocaleLowerCase() && a1.value === a0.value
          );
          if (hit) common.push(a0.value);
        }
        // If they share at least one term, using only that term is incomplete → undefined.
        if (common.length > 0) {
          const id = vp.getVariationId(common);
          expect(id).toBeUndefined();
        }
      }
    }
  });
});
