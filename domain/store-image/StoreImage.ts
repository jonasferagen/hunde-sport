// domain/StoreImage.ts

export interface StoreImageData {
  id: number;
  src: string;
  thumbnail: string;
  srcset?: string;
  sizes?: string;
  name: string;
  alt: string;
}

export class StoreImage implements StoreImageData {
  id: number;
  src: string;
  thumbnail: string;
  srcset?: string;
  sizes?: string;
  name: string;
  alt: string;

  constructor(data: StoreImageData) {
    if (data.id === undefined) {
      throw new Error(
        "Invalid StoreImageData: missing required fields: " +
          JSON.stringify(data)
      );
    }

    this.id = data.id;
    this.src = data.src;
    this.thumbnail = data.thumbnail;
    this.srcset = data.srcset ?? "";
    this.sizes = data.sizes ?? "";
    this.name = data.name ?? "";
    this.alt = data.alt ?? "";
  }
  bestSrc(): string {
    return this.srcset && this.srcset.length > 0 ? this.srcset : this.src;
  }

  bestThumb(): string {
    return this.thumbnail && this.thumbnail.length > 0
      ? this.thumbnail
      : this.src;
  }

  static fromMaybe(data?: StoreImageData | null): StoreImage {
    return data ? new StoreImage(data) : StoreImage.DEFAULT;
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
