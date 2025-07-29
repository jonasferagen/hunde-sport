import { Image } from './Image';

export interface CategoryData {
  id: number;
  name: string;
  parent: number;
  image: Image;
  description: string;
}

export class Category implements CategoryData {
  id: number;
  name: string;
  parent: number;
  image: Image;
  description: string;

  constructor(data: CategoryData) {
    this.id = data.id;
    this.name = data.name;
    this.parent = data.parent;
    this.image = data.image;
    this.description = data.description;
  }


  shouldDisplay(): boolean {
    return this.description !== '#';
  }

  toString() {
    return 'Category ' + this.id + ': ' + this.name;
  }
}
