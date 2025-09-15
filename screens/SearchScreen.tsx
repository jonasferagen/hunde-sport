// SearchScreen.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

import {
  PageBody,
  PageHeader,
  PageSection,
  PageView,
} from "@/components/chrome/layout";
import { ProductList } from "@/components/features/product/list/ProductList";
import { Loader } from "@/components/ui/Loader";
import { ThemedText, ThemedXStack, ThemedYStack } from "@/components/ui/themed";
import { ThemedSpinner } from "@/components/ui/themed/ThemedSpinner";
import { DefaultTextContent } from "@/components/widgets/DefaultTextContent";
import { SearchBar } from "@/components/widgets/SearchBar";
import { useProductsBySearch } from "@/hooks/api/data/product/queries";
import { useScreenReady } from "@/hooks/ui/useScreenReady";
import { useDebouncedValue } from "@/hooks/useDebouncedValue"; // simple 200–300ms debounce hook

export const SearchScreen = () => {
  const ready = useScreenReady();

  const params = useLocalSearchParams<{ query?: string | string[] }>();
  const paramToString = (q: string | string[] | undefined) =>
    Array.isArray(q) ? (q[0] ?? "") : (q ?? "");

  const [query, setQuery] = React.useState(() => paramToString(params.query));
  const searchQuery: string = useDebouncedValue(query, 250);
  // keep local state in sync with URL when navigating here again
  React.useEffect(() => {
    setQuery(paramToString(params.query));
  }, [params.query]);

  const isSearchable: boolean = ready && searchQuery.trim().length >= 2;
  // “User is typing” (debounce active, no request yet)
  const isDebounceActive: boolean =
    ready && query.trim().length >= 2 && query !== searchQuery;

  const result = useProductsBySearch(searchQuery, {
    enabled: isSearchable,
  });

  const router = useRouter();
  const submitInThisScreen = (text: string) => {
    const q = text.trim();
    setQuery(q);
    // keep URL shareable (optional but nice)
    router.setParams({ query: q || undefined });
  };

  const isSearching = isDebounceActive || result.isFetching;
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
          <ThemedText f={1}>{title}</ThemedText>
          <ThemedText f={0}>{total}</ThemedText>
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
                isLoading={result.isLoading}
              />
            </ThemedYStack>
          )}
        </PageSection>
      </PageBody>
    </PageView>
  );
};
