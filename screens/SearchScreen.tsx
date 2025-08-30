// SearchScreen.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { SizableText } from "tamagui";

import { ProductList } from "@/components/features/product/list/ProductList";
import {
  PageBody,
  PageHeader,
  PageSection,
  PageView,
} from "@/components/layout";
import { ThemedXStack, ThemedYStack } from "@/components/ui";
import { DefaultTextContent } from "@/components/ui/DefaultTextContent";
import { SearchBar } from "@/components/ui/search-bar/SearchBar";
import { ThemedSpinner } from "@/components/ui/themed-components/ThemedSpinner";
import { useProductsBySearch } from "@/hooks/data/Product";
import { useScreenReady } from "@/hooks/ui/useScreenReady";
import { useDebouncedValue } from "@/hooks/useDebouncedValue"; // simple 200–300ms debounce hook

import { Loader } from "../components/ui/Loader";

export const SearchScreen = () => {
  const ready = useScreenReady();

  const params = useLocalSearchParams<{ query?: string | string[] }>();

  // coerce param to a plain string (Expo can give string[])
  const paramToString = (q: string | string[] | undefined) =>
    Array.isArray(q) ? (q[0] ?? "") : (q ?? "");

  const [query, setQuery] = React.useState(() => paramToString(params.query));

  // ✅ keep local state in sync with URL when navigating here again
  React.useEffect(() => {
    setQuery(paramToString(params.query));
  }, [params.query]);

  const searchQuery = useDebouncedValue(query, 250);

  const result = useProductsBySearch(searchQuery, {
    enabled: ready && searchQuery.trim().length > 0,
  });

  const router = useRouter();
  const submitInThisScreen = (text: string) => {
    const q = text.trim();
    setQuery(q);
    // keep URL shareable (optional but nice)
    router.setParams({ query: q || undefined });
  };

  const isSearching = result.isLoading && !!searchQuery;
  const title = query
    ? `Søkeresultater for "${query}"`
    : "Søk etter produkter, merker og kategorier.";
  const total = isSearching ? <ThemedSpinner /> : `(${result.total ?? 0})`;

  return (
    <PageView>
      <PageHeader container>
        <ThemedYStack>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSubmit={submitInThisScreen} // <- keep URL & state in sync
            placeholder="Produktsøk"
          />
        </ThemedYStack>
        <ThemedXStack split>
          <SizableText f={1}>{title}</SizableText>
          <SizableText f={0}>{total}</SizableText>
        </ThemedXStack>
      </PageHeader>
      <PageBody>
        <PageSection fill f={1} mih={0}>
          {/* Show nothing (or a subtle placeholder) until ready */}
          {!ready ? null : !searchQuery ? null : result.isLoading ? (
            <Loader />
          ) : !result.items?.length ? (
            <DefaultTextContent>
              Ingen resultater funnet for &quot;{searchQuery}&quot;
            </DefaultTextContent>
          ) : (
            <ThemedYStack f={1} mih={0}>
              <ProductList
                transitionKey={searchQuery}
                products={result.items}
                loadMore={result.fetchNextPage}
                isLoadingMore={result.isLoading || result.isFetchingNextPage}
                hasMore={result.hasNextPage}
                totalProducts={result.total}
              />
            </ThemedYStack>
          )}
        </PageSection>
      </PageBody>
    </PageView>
  );
};
