import type { Category } from '../../../types';

export interface CategoryState {
    items: Category[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

export interface CategoryContextType {
    getCategoryState: (CategoryId: number) => CategoryState;
    loadMore: (CategoryId: number) => void;
    refresh: (CategoryId: number) => void;
    setCategoryId: (id: number) => void;
}

export default CategoryContextType;