import { useContext } from 'react';
import ProductCategoryContext from './ProductCategoryContext/ProductCategoryProvider';

export const useProductCategories = (categoryId: number) => {
    const context = useContext(ProductCategoryContext);
    if (!context) throw new Error('This hook must be used within a ProductCategoryProvider');

    const state = context.getCategoryState(categoryId);

    return {
        ...state,
        categories: state.items, // optional alias
        loadMore: () => context.loadMore(categoryId),
        refresh: () => context.refresh(categoryId),
        setProductCategoryId: context.setProductCategoryId,
        getProductCategoryById: context.getProductCategoryById,
    };
};

export default useProductCategories;