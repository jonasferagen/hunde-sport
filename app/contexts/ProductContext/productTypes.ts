import type { Product } from '../../../types';

export interface ProductState {
    products: Product[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

export interface ProductContextType {
    getProductState: (categoryId: number | null) => ProductState;
    getProductById: (productId: number) => Promise<Product | null>;
    loadMore: (categoryId: number | null) => void;
    refresh: (categoryId: number | null) => void;
    setActiveCategoryId: (id: number | null) => void;
}
