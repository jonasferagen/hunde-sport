import { endpoints, type Pagination } from "@/hooks/api/api";
import { apiClient } from "@/lib/api/apiClient";
import { responseTransformer } from "@/lib/api/responseTransformer";
import { ProductCategory } from "@/types";

export async function fetchProductCategories(pagination?: Pagination) {
  const response = await apiClient.get<any[]>(
    endpoints.categories.list(pagination)
  );
  return responseTransformer(response, ProductCategory.create);
}

