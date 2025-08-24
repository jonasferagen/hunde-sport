import { Cart } from '@/domain/Cart/Cart';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchCart } from './api';


export const useCart = (options = { enabled: true }): UseQueryResult<Cart> => {
    const result = useQuery({
        queryKey: ['cart'],
        queryFn: () => fetchCart(),
        ...options,
    });
    return result;
}; 