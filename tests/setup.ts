// tests/setup.ts
import { StoreImage } from "@/domain/StoreImage";

beforeAll(() => {
  StoreImage.configureImageSizeProvider(async () => ({ width: 800, height: 600 }));
});
