import { AnimalIcon } from "@/components/ui/AnimalIcon";
import { ThemedSpinner } from "@/components/ui/themed/ThemedSpinner";
import {
  ThemedYStack,
  type ThemedYStackProps,
} from "@/components/ui/themed/ThemedStacks";
import { THEME_LOADER } from "@/config/app";

export const Loader = ({ ...props }: ThemedYStackProps) => {
  return (
    <ThemedYStack f={1} jc="center" ai="center" theme={THEME_LOADER} {...props}>
      <ThemedSpinner size="large" o={0.7} color="$background" />
      <AnimalIcon size="$1" col="$background" />
    </ThemedYStack>
  );
};
