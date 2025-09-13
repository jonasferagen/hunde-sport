import { endpoints, type PaginationOpts } from "@/hooks/api/api";
import { getApiClient } from "@/lib/api/apiClient";
import { responseTransformer } from "@/lib/api/responseTransformer";
import { ProductCategory } from "@/types";

export async function fetchProductCategories(pagination?: PaginationOpts) {
  const response = await getApiClient().get<any[]>(
    endpoints.categories.list(pagination),
  );
  return responseTransformer(response, ProductCategory.create);
}
