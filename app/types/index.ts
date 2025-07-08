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
  // Add more product fields as needed
}

export interface CategoryItemProps {
  item: Category;
}

// Re-export all types for easier imports
export * from './index';
