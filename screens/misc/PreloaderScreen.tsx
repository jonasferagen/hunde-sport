// app/(preloader)/PreloaderScreen.tsx
import { RefreshCw } from "@tamagui/lucide-icons";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { Image, Paragraph } from "tamagui";

import { ThemedText, ThemedYStack } from "@/components/ui";
import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { useCart } from "@/hooks/data/Cart";
import { useProductCategories } from "@/hooks/data/ProductCategory";
import { useAutoPaginateQueryResult } from "@/lib/query/query";
import { queryClient } from "@/lib/queryClient";
import { useProductCategoryStore } from "@/stores/productCategoryStore";
import { useCartStore } from "@/stores/useCartStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

/** -------------------- Screen -------------------- **/
export const PreloaderScreen = () => {
  const fonts = useFontsStep();
  const cart = useCartStep({ enabled: fonts.ready });
  const categories = useCategoriesStep({ enabled: cart.ready });

  // static labels for the 3 sequential steps
  const labels = [
    "Henter skrifttyper..",
    "Henter handlekurv..",
    "Henter kategorier..",
  ] as const;

  // figure out which step is active purely from readiness
  const steps = [fonts, cart, categories] as const;
  const activeIndex = steps.findIndex((s) => !s.ready);
  const allReady = activeIndex === -1;
  const active = allReady ? null : steps[activeIndex];

  React.useEffect(() => {
    if (fonts.ready) SplashScreen.hideAsync().catch(() => {});
  }, [fonts.ready]);

  React.useEffect(() => {
    if (allReady) router.replace("/(app)");
  }, [allReady]);

  return (
    <PreloaderView
      label={allReady ? "" : labels[activeIndex]}
      progress={active?.progress}
      error={active?.error}
      onRetry={active?.retry}
    />
  );
};

/** -------------------- Steps -------------------- **/
type StepState = {
  ready: boolean;
  progress?: string;
  error?: Error | null;
  retry?: () => void;
};

/* 1) Fonts */
function useFontsStep(): StepState {
  const [ready] = useFonts({
    Montserrat: require("@/assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat/Montserrat-Bold.ttf"),
  });
  return { ready };
}

/* 2) Cart */
function useCartStep({ enabled }: { enabled: boolean }): StepState {
  const { data, isSuccess, isError, error, refetch, isFetching } = useCart({
    enabled,
  });
  const setCart = useCartStore((s) => s.setCart);

  React.useEffect(() => {
    if (isSuccess) setCart(data ?? null);
  }, [isSuccess, data, setCart]);

  const ready = !!data && isSuccess;
  const progress = enabled && isFetching ? "…" : undefined;
  const retry = isError ? () => refetch() : undefined;

  return {
    ready,
    progress,
    error: (isError ? (error as Error) : null) ?? null,
    retry,
  };
}

/* 3) Product Categories */
function useCategoriesStep({ enabled }: { enabled: boolean }): StepState {
  const setProductCategories = useProductCategoryStore(
    (s) => s.setProductCategories
  );

  const result = useProductCategories({ enabled });
  useAutoPaginateQueryResult(result);

  const { isFetching, items, total, error, refetch } = result;

  // push into store
  React.useEffect(() => {
    if (enabled) setProductCategories(items);
  }, [enabled, items, setProductCategories]);

  const count = items.length;
  const ready = !isFetching && count >= total;

  const progress = !ready
    ? total && total > 0
      ? `(${Math.min(count, total)}/${total})`
      : undefined
    : undefined;

  const retry = error
    ? async () => {
        await queryClient.resetQueries({ queryKey: ["product-categories"] });
        refetch();
      }
    : undefined;

  return { ready, progress, error: (error as Error) ?? null, retry };
}

/** -------------------- View -------------------- **/
type PreloaderViewProps = {
  label?: string;
  progress?: string;
  error?: Error | null;
  onRetry?: () => void;
};

function PreloaderView({
  label,
  progress,
  error,
  onRetry,
}: PreloaderViewProps) {
  const showPanel = !!label || !!progress || !!error;
  return (
    <ThemedYStack f={1} box p="$4">
      <ThemedYStack f={1} jc="flex-end" ai="center" mt={Math.round(200 / 2)}>
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={{ width: 200, height: 200 }}
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
          {!!label && (
            <ThemedText size="$4" tabular ta="center" o={error ? 1 : 0.9}>
              {label}
            </ThemedText>
          )}

          {!!progress && !error && (
            <Paragraph ta="center" o={0.8}>
              {progress}
            </Paragraph>
          )}

          {error && (
            <>
              <Paragraph ta="center" o={0.8}>
                {error.message}
              </Paragraph>
              {!!onRetry && (
                <CallToActionButton
                  w="60%"
                  label="Prøv igjen"
                  after={<RefreshCw />}
                  onPress={onRetry}
                />
              )}
            </>
          )}
        </ThemedYStack>
      </ThemedYStack>
    </ThemedYStack>
  );
}
