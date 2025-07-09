import type { Product } from '../../../types';

export interface ProductState {
    items: Product[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

export interface ProductContextType {
    getProductState: (productId: number) => ProductState;
    getProductById: (productId: number) => Promise<Product | null>;
    loadMore: (productId: number) => void;
    refresh: (productId: number) => void;
    // setActiveProductId: (id: number) => void;
}

export default ProductContextType;