import { useContext } from 'react';
import ProductCategoryContext from './ProductCategoryContext';

export const useProductCategories = (productCategoryId: number) => {
    const context = useContext(ProductCategoryContext);
    if (!context) throw new Error('This hook must be used within a ProductCategoryProvider');

    const state = context.getCategoryState(productCategoryId);

    return {
        ...state,
        items: state.items, // optional alias
        loadMore: () => context.loadMore(productCategoryId),
        refresh: () => context.refresh(productCategoryId),
        setProductCategoryId: context.setProductCategoryId,
        getProductCategoryById: context.getProductCategoryById,
    };
};

export default useProductCategories;