import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from './api';

export const useCategories = () => {

    const queryResult = useQuery({
        queryKey: ['categories'],
        queryFn: () => fetchCategories(),
    });

    return queryResult;


};

