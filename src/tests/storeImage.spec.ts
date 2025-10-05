// tests/storeImage.spec.ts
import { StoreImage } from "@/domain/StoreImage";

test("getIntrinsicSize caches and uses provider", async () => {
  const calls: string[] = [];
  StoreImage.configureImageSizeProvider(async (uri) => {
    calls.push(uri);
    return { width: 800, height: 600 };
  });

  const img = new (StoreImage as any)({
    id: 1, src: "https://example/img.jpg", thumbnail: "", srcset: "", sizes: "",
    name: "img", alt: "",
  }) as StoreImage;

  const a = await img.getIntrinsicSize();
  const b = await img.getIntrinsicSize();
  expect(a).toEqual({ width: 800, height: 600 });
  expect(b).toEqual(a);
  expect(calls).toHaveLength(1); // cached on second call
});
