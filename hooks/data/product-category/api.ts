import { endpoints, type Pagination } from "@/config/api";
import { apiClient } from "@/lib/apiClient";
import { responseTransformer } from "@/lib/query/responseTransformer";
import { ProductCategory } from "@/types";

export async function fetchProductCategories(pagination?: Pagination) {
  const response = await apiClient.get<any[]>(
    endpoints.categories.list(pagination)
  );
  return responseTransformer(response, ProductCategory.create);
}

/*
export async function fetchProductCategory(id: number) {
  const response = await apiClient.get<any[]>(ENDPOINTS.CATEGORIES.GET(id));
  return mapToProductCategory(response.data);
}
*/
