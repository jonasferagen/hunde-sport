// domain/store-image/StoreImage.ts
import { getDevicePixelRatio } from "@/lib/image/dpr";
export type ImageIntrinsicSize = { width: number; height: number };
export type ImageSizeProvider = (uri: string) => Promise<ImageIntrinsicSize>;
export type ImageScaleFunction = (
  imageUrl: string,
  targetWidthPx: number,
  targetHeightPx: number,
  fitMode?: "auto" | "resize" | "fit", // auto: width-only/height-only; resize: crop; fit: no-crop
  quality?: number, // 10–100
) => string;

export type StoreImageData = {
  id: number;
  src: string;
  thumbnail: string;
  srcset?: string;
  sizes?: string;
  name: string;
  alt: string;
} | null;

interface NormalizedStoreImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

export class StoreImage implements NormalizedStoreImage {
  readonly id: number;
  readonly src: string;
  readonly thumbnail: string;
  readonly srcset: string;
  readonly sizes: string;
  readonly name: string;
  readonly alt: string;

  private _intrinsicWidth?: number;
  private _intrinsicHeight?: number;
  private _aspectRatio?: number;

  private constructor(data: NormalizedStoreImage) {
    this.id = data.id;
    this.src = data.src;
    this.thumbnail = data.thumbnail;
    this.srcset = data.srcset;
    this.sizes = data.sizes;
    this.name = data.name;
    this.alt = data.alt;
  }

  private static imageSizeProvider: ImageSizeProvider | null = null;
  private static imageScaleFunction: ImageScaleFunction | null = null;

  static configureImageSizeProvider(provider: ImageSizeProvider) {
    StoreImage.imageSizeProvider = provider;
  }
  static configureImageScaleFunction(imageScaleFunction: ImageScaleFunction) {
    StoreImage.imageScaleFunction = imageScaleFunction;
  }
  /**
   * Lazily load the intrinsic image size and cache it.
   */
  async getIntrinsicSize(): Promise<ImageIntrinsicSize> {
    if (this._intrinsicWidth && this._intrinsicHeight) {
      return { width: this._intrinsicWidth, height: this._intrinsicHeight };
    }
    const provider = StoreImage.imageSizeProvider;
    if (!provider) {
      // safe fallback for non-RN/test environments
      return { width: 0, height: 0 };
    }
    const { width, height } = await provider(this.src);
    this._intrinsicWidth = width;
    this._intrinsicHeight = height;

    if (width > 0 && height > 0) {
      this._aspectRatio = width / height;
    }

    return { width, height };
  }

  /**
   * Aspect ratio (width / height) if known, otherwise undefined.
   */
  get aspectRatio(): number | undefined {
    if (this._aspectRatio) return this._aspectRatio;
    if (this._intrinsicWidth && this._intrinsicHeight) {
      this._aspectRatio = this._intrinsicWidth / this._intrinsicHeight;
      return this._aspectRatio;
    }
    return undefined;
  }

  qualityAt(displayWidth: number, dpr: number): "ok" | "low" {
    if (!this._intrinsicWidth) return "ok"; // unknown yet
    const ratio = this._intrinsicWidth / (displayWidth * dpr);
    return ratio < 0.75 ? "low" : "ok";
  }

  /**
   * Returns a scaled URI for rendering at the given display size and DPR.
   * - If no scaler is configured, falls back to original `src`.
   * - Caller controls DPR policy (e.g., `Math.min(PixelRatio.get(), 2)`).
   */
  getScaledUri(displayWidthPx: number, displayHeightPx?: number): string {
    const imageScaleFunction = StoreImage.imageScaleFunction;
    if (!imageScaleFunction) return this.src;

    const dpr = getDevicePixelRatio();

    const targetWidthPx =
      displayWidthPx > 0 ? Math.round(displayWidthPx * dpr) : 0;

    // IMPORTANT: do NOT clamp to 1; allow 0 to mean “no height”
    const targetHeightPx =
      displayHeightPx && displayHeightPx > 0
        ? Math.round(displayHeightPx * dpr)
        : 0;

    return imageScaleFunction(this.src, targetWidthPx, targetHeightPx);
  }

  static create(data?: StoreImageData): StoreImage {
    if (!data) return StoreImage.DEFAULT;
    // normalize with safe defaults
    return new StoreImage({
      id: typeof data.id === "number" ? data.id : 0,
      src: data.src,
      thumbnail: data.thumbnail ?? data.src ?? "",
      srcset: data.srcset ?? "",
      sizes: data.sizes ?? "",
      name: data.name,
      alt: data.alt,
    });
  }

  static readonly DEFAULT = Object.freeze(
    StoreImage.create({
      id: 0,
      src: "",
      thumbnail: "",
      name: "",
      alt: "",
      srcset: "",
      sizes: "",
    }),
  ) as StoreImage;
}
