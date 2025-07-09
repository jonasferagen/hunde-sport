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
    getCategoryState: (parentId: number | null) => CategoryState;
    loadMore: (parentId: number | null) => void;
    refresh: (parentId: number | null) => void;
    setParentId: (id: number | null, name?: string) => void;
}

export default CategoryContextType;