---
# 🏗 Domain Model Guidelines

This document describes how to structure domain models consistently across the project.
---

## 1. API Shapes

- Always use `type` for Store API / backend payloads.
- Should mirror the API responses, including `null` and optional fields.

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

- Constructor should accept a `NormalizedX`.
- No direct construction from raw — must go through `.create()`.
- Classes that mirror API data should in general be read only

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

We use a single root alias: @/ → project root.
All imports must be of the form:
@/domain/...
@/components/...
@/hooks/...
