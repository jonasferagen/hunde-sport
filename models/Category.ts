import { Image } from './Image';

export interface CategoryData {
  id: number;
  name: string;
  parent: number;
  image: Image;
  count: number;
}

export class Category implements CategoryData {
  id: number;
  name: string;
  parent: number;
  image: Image;
  count: number;

  constructor(data: CategoryData) {
    this.id = data.id;
    this.name = data.name;
    this.parent = data.parent;
    this.image = data.image;
    this.count = data.count;
  }

  toString() {
    return 'Category ' + this.id + ': ' + this.name;
  }
}
