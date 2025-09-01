---
# 🏗 Domain Model Guidelines

This document describes how to structure domain models consistently across the project.
---

## 1. API Shapes

- Always use `type` for Store API / backend payloads.
- Must mirror the API exactly — including `null` and optional fields.

```ts
export type ProductData = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  images?: StoreImageData[] | null;
  // ...
};
```

---

## 2. Normalized Constructor Input

- Define a `type NormalizedX` for the safe, normalized shape used inside domain classes.
- All invariants must hold (no nullable/optional unless intentional).

```ts
type NormalizedProductCategory = {
  id: number;
  name: string;
  parent: number;
  image: StoreImage;
  description: string;
  slug: string;
  count: number;
};
```

---

## 3. Domain Classes

- Always `class X` with `readonly` fields.
- Constructor must accept a `NormalizedX`.
- No direct construction from raw — must go through `.create()`.

```ts
export class ProductCategory {
  readonly id: number;
  readonly name: string;
  readonly parent: number;
  readonly image: StoreImage;
  readonly description: string;
  readonly slug: string;
  readonly count: number;

  private constructor(data: NormalizedProductCategory) {
    this.id = data.id;
    this.name = data.name;
    this.parent = data.parent;
    this.image = data.image;
    this.description = data.description;
    this.slug = data.slug;
    this.count = data.count;
  }

  static create(data: ProductCategoryData): ProductCategory {
    return new ProductCategory({
      id: data.id,
      name: data.name,
      parent: data.parent,
      image: StoreImage.create(data.image),
      description: data.description ?? "",
      slug: data.slug,
      count: data.count,
    });
  }
}
```

---

## 4. Factories

- Each class must implement a static `create(data: XData): X`.
- `create` is responsible for **normalization** (safe defaults, cleaning HTML, handling nulls).

---

## 5. Defaults & Sentinels

- Define sentinel instances for UI fallbacks.
- Examples:
  - `StoreImage.DEFAULT`
  - `ProductCategory.ROOT`

```ts
static readonly ROOT = new ProductCategory({
  id: 0,
  name: "Hjem",
  parent: -1,
  image: StoreImage.DEFAULT,
  description: "",
  slug: "",
  count: 0,
});
```

---

## 6. Error Handling

- Constructors should **enforce invariants strictly** (throw if required data is missing).
- `create` may **skip** or **prune** bad data only if explicitly documented (e.g. duplicate variations, missing terms).

---

## 7. Tests

Each domain class should have fixture-driven tests covering:

- ✅ Data → `create` → instance is valid.
- ✅ Invariants hold (e.g. `variationIdSet.size === variationIds.length`).
- ✅ Defaults behave consistently.
- ✅ Known bad input is handled (skip, normalize, or throw).

---

## Summary

- `type XData` → mirrors API exactly.
- `type NormalizedX` → constructor input, safe & normalized.
- `class X` → domain object with invariants, readonly fields, and `.create`.
- ✅ Consistent, strict, and testable.

---
