// domain/store-image/StoreImage.ts
export interface RawStoreImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset?: string;
  sizes?: string;
  name?: string;
  alt?: string;
}

export interface StoreImageData {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

export class StoreImage implements StoreImageData {
  readonly id: number;
  readonly src: string;
  readonly thumbnail: string;
  readonly srcset: string;
  readonly sizes: string;
  readonly name: string;
  readonly alt: string;

  private constructor(data: StoreImageData) {
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

  static fromMaybe(raw?: RawStoreImage | null): StoreImage {
    if (!raw) return StoreImage.DEFAULT;
    // normalize with safe defaults
    return new StoreImage({
      id: typeof raw.id === "number" ? raw.id : 0,
      src: raw.src ?? "",
      thumbnail: raw.thumbnail ?? raw.src ?? "",
      srcset: raw.srcset ?? "",
      sizes: raw.sizes ?? "",
      name: raw.name ?? "",
      alt: raw.alt ?? "",
    });
  }

  static readonly DEFAULT = Object.freeze(
    new StoreImage({
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
