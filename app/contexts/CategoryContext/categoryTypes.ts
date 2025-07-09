import type { Category } from '../../../types';

export interface CategoryState {
    categories: Category[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

export interface CategoryContextType {
    getCategoryState: (parentId: number) => CategoryState;
    loadMore: (parentId: number) => void;
    refresh: (parentId: number) => void;
    setParentId: (id: number) => void;
}

export default CategoryContextType;