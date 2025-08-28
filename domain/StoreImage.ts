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
    this.name = data.name;
    this.alt = data.alt;
  }

  /** Shared default/placeholder instance */
  static readonly DEFAULT = new StoreImage({
    id: 0,
    src: "",
    thumbnail: "",
    name: "",
    alt: "",
    srcset: "",
    sizes: "",
  });
}
