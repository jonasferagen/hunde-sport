// app/(preloader)/PreloaderScreen.tsx
import { RefreshCw } from "@tamagui/lucide-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { Image, Paragraph } from "tamagui";

import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { ThemedText, ThemedYStack } from "@/components/ui/themed";
import { useCart } from "@/hooks/api/data/cart/queries";
import { useProductCategories } from "@/hooks/api/data/product-category/queries";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import { useAutoPaginateQueryResult } from "@/lib/api/query";
import { queryClient } from "@/lib/api/queryClient";
import { useProductCategoryStore } from "@/stores/productCategoryStore";
import { useCartStore } from "@/stores/useCartStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

/** -------------------- Screen -------------------- **/
export const PreloaderScreen = () => {
  const fonts = useFontsStep();

  // Start data once fonts are ready; never toggle back.
  const data = useBootData({ enabled: fonts.ready });
  const { to } = useCanonicalNavigation();
  const hasNavigatedRef = React.useRef(false);

  // Hide splash once fonts are ready (do this once; no regress)
  React.useEffect(() => {
    if (fonts.ready) SplashScreen.hideAsync().catch(() => {});
  }, [fonts.ready]);

  // Navigate when both data tasks are done (cart + categories)
  React.useEffect(() => {
    if (data.allDone && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      to("index");
    }
  }, [data.allDone, to]);

  const showPanel = !fonts.ready || !data.allDone || !!data.error;

  return (
    <ThemedYStack f={1} box p="$4">
      <ThemedYStack f={1} jc="flex-end" ai="center" mt={Math.round(200 / 2)}>
        <Image
          source={require("@/assets/images/splash-icon.png")}
          w={200}
          h={200}
        />
      </ThemedYStack>

      <ThemedYStack f={1} jc="flex-start" ai="center">
        <ThemedYStack
          w="100%"
          maw={420}
          p="$2"
          br="$2"
          bg="$backgroundHover"
          minHeight={120}
          ai="center"
          opacity={showPanel ? 1 : 0}
        >
          {/* Headline */}
          <ThemedText size="$4" tabular ta="center" o={data.error ? 1 : 0.9}>
            {!fonts.ready
              ? "Henter skrifttyper…"
              : !data.allDone
                ? "Klargjør data…"
                : ""}
          </ThemedText>

          {/* Progress lines */}
          {fonts.ready && !data.allDone && !data.error && (
            <>
              <Paragraph ta="center" o={0.8}>
                Handlekurv:{" "}
                {data.cart.ready ? "✓" : data.cart.fetching ? "…" : "–"}
              </Paragraph>
              <Paragraph ta="center" o={0.8}>
                Kategorier:{" "}
                {data.categories.ready
                  ? "✓"
                  : (data.categories.progress ??
                    (data.categories.fetching ? "…" : "–"))}
              </Paragraph>
            </>
          )}

          {/* Error + Retry */}
          {data.error && (
            <>
              <Paragraph ta="center" o={0.9}>
                {data.error.message}
              </Paragraph>
              <CallToActionButton
                w="60%"
                label="Prøv igjen"
                after={<RefreshCw />}
                onPress={data.retry}
              />
            </>
          )}
        </ThemedYStack>
      </ThemedYStack>
    </ThemedYStack>
  );
};

/** -------------------- Steps -------------------- **/

type StepState = {
  ready: boolean;
  fetching?: boolean;
  progress?: string;
  error?: Error | null;
};

function useFontsStep(): StepState {
  const [loaded] = useFonts({
    Montserrat: require("@/assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat/Montserrat-Bold.ttf"),
  });

  // One-way toggle: once true, never false
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (loaded) setReady(true);
  }, [loaded]);

  return { ready };
}

function useBootData({ enabled }: { enabled: boolean }) {
  const setCart = useCartStore((s) => s.setCart);
  const setProductCategories = useProductCategoryStore(
    (s) => s.setProductCategories,
  );

  // Gate both queries from a single flag that only moves false -> true
  const [dataEnabled, setDataEnabled] = React.useState(false);
  React.useEffect(() => {
    if (enabled) setDataEnabled(true);
  }, [enabled]);

  /** Cart */
  const {
    data: cartData,
    isFetching: cartFetching,
    isSuccess: cartSuccess,
    isError: cartIsError,
    error: cartError,
    refetch: refetchCart,
  } = useCart({ enabled: dataEnabled });

  // Mark done once; never regress on refetch
  const [cartDone, setCartDone] = React.useState(false);
  React.useEffect(() => {
    if (!cartDone && cartSuccess && cartData) {
      setCart(cartData);
      setCartDone(true);
    }
  }, [cartDone, cartSuccess, cartData, setCart]);

  /** Categories (infinite) */
  const catResult = useProductCategories({ enabled: dataEnabled });
  useAutoPaginateQueryResult(catResult);

  const {
    isFetching: catFetching,
    items,
    total,
    isError: catIsError,
    error: catError,
    refetch: refetchCats,
  } = catResult;

  // Done when we've fetched all pages (never regress)
  const [categoriesDone, setCategoriesDone] = React.useState(false);
  const categoriesReadyNow = Boolean(
    !catFetching && total && items.length >= (total ?? 0),
  );
  React.useEffect(() => {
    if (!categoriesDone && categoriesReadyNow) {
      setProductCategories(items);
      setCategoriesDone(true);
    }
  }, [categoriesDone, categoriesReadyNow, items, setProductCategories]);

  const categoriesProgress =
    total && total > 0
      ? `(${Math.min(items.length, total)}/${total})`
      : undefined;

  /** Aggregate */
  const anyError =
    (cartIsError && (cartError as Error)) ||
    (catIsError && (catError as Error)) ||
    null;
  const allDone = cartDone && categoriesDone;

  const retry = async () => {
    // Clear only relevant queries and refetch
    await queryClient.resetQueries({ queryKey: ["cart"] });
    await queryClient.resetQueries({ queryKey: ["product-categories"] });
    refetchCart();
    refetchCats();
  };

  return {
    allDone,
    error: anyError,
    retry,
    cart: {
      ready: cartDone,
      fetching: cartFetching,
    },
    categories: {
      ready: categoriesDone,
      fetching: catFetching,
      progress: categoriesProgress,
    },
  };
}
