export interface Image {
  src: string;
}

export interface Category {
  id: number;
  name: string;
  image?: Image;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  short_description: string;
  categories: Category[];
  images: Image[];
  // Add more product fields as needed
}

export interface CategoryItemProps {
  item: Category;
}

