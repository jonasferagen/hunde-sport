// domain/store-image/StoreImage.ts

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

  private constructor(data: NormalizedStoreImage) {
    this.id = data.id;
    this.src = data.src;
    this.thumbnail = data.thumbnail;
    this.srcset = data.srcset;
    this.sizes = data.sizes;
    this.name = data.name;
    this.alt = data.alt;
  }

  bestSrc(): string {
    return this.srcset && this.srcset.length > 0 ? this.srcset : this.src;
  }
  bestThumb(): string {
    return this.thumbnail && this.thumbnail.length > 0
      ? this.thumbnail
      : this.src;
  }

  static create(data: StoreImageData): StoreImage {
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
    })
  ) as StoreImage;
}
