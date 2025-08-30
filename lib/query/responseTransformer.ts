// @/lib/query/responseTransformer.ts

type ApiResponseLike = {
  problem?: string | null;
  data?: unknown;
  headers?: Record<string, string | number | undefined>;
};

type Meta = {
  endpoint?: string;
  query?: Record<string, any>;
};

export type Page<T> = {
  data: T[];
  totalPages: number;
  total: number;
};

export const responseTransformer = <T>(
  response: ApiResponseLike,
  mapper: (item: any) => T,
  meta?: Meta
): Page<T> => {
  const totalPages = Number(response.headers?.["x-wp-totalpages"] ?? 0);
  const total = Number(response.headers?.["x-wp-total"] ?? 0);
  const src = Array.isArray(response.data) ? response.data : [];

  const data: T[] = [];

  for (let i = 0; i < src.length; i++) {
    const raw = src[i];
    try {
      data.push(mapper(raw)); // e.g., Product.fromRaw
    } catch (e) {
      if (__DEV__) throw e;
    }
  }

  return { data, totalPages, total };
};
