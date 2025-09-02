import { intersectSets } from "@/lib/util";

describe("intersectSets()", () => {
  test("no sets → empty set", () => {
    const res = intersectSets();
    expect(res).toBeInstanceOf(Set);
    expect(res.size).toBe(0);
  });

  test("single set → returns same instance", () => {
    const a = new Set([1, 2, 3]);
    const res = intersectSets(a);
    expect(res).toBe(a);
  });

  test("two sets → correct intersection", () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3, 4]);
    const res = intersectSets(a, b);
    expect(res.size).toBe(2);
    expect(res.has(2)).toBe(true);
    expect(res.has(3)).toBe(true);
    expect(res.has(1)).toBe(false);
    expect(res.has(4)).toBe(false);

    // inputs unchanged
    expect(Array.from(a)).toEqual([1, 2, 3]);
    expect(Array.from(b)).toEqual([2, 3, 4]);
  });

  test("multiple sets (order irrelevant) → correct intersection", () => {
    const a = new Set([1, 2, 3, 4]);
    const b = new Set([2, 3]);
    const c = new Set([3, 5, 2, 9]);

    const r1 = intersectSets(a, b, c);
    const r2 = intersectSets(c, a, b);

    // Both should contain exactly {2, 3}
    [r1, r2].forEach((r) => {
      expect(r.size).toBe(2);
      expect(r.has(2)).toBe(true);
      expect(r.has(3)).toBe(true);
    });
  });

  test("disjoint sets → empty set", () => {
    const a = new Set([1]);
    const b = new Set([2]);
    const res = intersectSets(a, b);
    expect(res.size).toBe(0);
  });

  test("does not mutate inputs", () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 4]);
    const aBefore = Array.from(a);
    const bBefore = Array.from(b);

    void intersectSets(a, b);

    expect(Array.from(a)).toEqual(aBefore);
    expect(Array.from(b)).toEqual(bBefore);
  });
});
