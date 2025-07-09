import { ENDPOINTS } from '../../../config/api';
import { ProductCategory } from '../../../types';
import apiClient from '../../../utils/apiClient';

const mapToCategory = (item: any): ProductCategory => ({
    id: item.id,
    name: item.name,
    parent: item.parent,
    image: item.image,
});

export async function fetchProductCategoryData(CategoryId: number, pageNum: number) {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.LIST(pageNum, CategoryId)
    );
    if (error) throw new Error(error);
    return data?.map(mapToCategory) ?? [];
}

export default fetchProductCategoryData;