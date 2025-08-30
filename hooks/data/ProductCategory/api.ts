import { ENDPOINTS, PaginationOptions } from "@/config/api";
import { apiClient } from "@/lib/apiClient";
import { responseTransformer } from "@/lib/query/responseTransformer";
import { ProductCategory } from "@/types";

export async function fetchProductCategories(pagination?: PaginationOptions) {
  const response = await apiClient.get<any[]>(
    ENDPOINTS.CATEGORIES.LIST(pagination)
  );
  return responseTransformer(response, ProductCategory.fromRaw);
}

/*
export async function fetchProductCategory(id: number) {
  const response = await apiClient.get<any[]>(ENDPOINTS.CATEGORIES.GET(id));
  return mapToProductCategory(response.data);
}
*/
