import { useContext } from 'react';
import ProductContext from './ProductContext';

export const useProductsByProductCategoryId = (productCategoryId: number) => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('This hook must be used within a ProductContextProvider');

    const state = context.getProductState(productCategoryId);

    console.log(state);

    return {
        ...state,
        items: state.items, // optional alias
        loadMore: () => context.loadMore(productCategoryId),
        refresh: () => context.refresh(productCategoryId),
    };
};

export default useProductsByProductCategoryId;