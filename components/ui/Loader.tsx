import { AnimalIcon } from "@/components/ui/AnimalIcon";
import { ThemedSpinner } from "@/components/ui/themed/ThemedSpinner";
import {
  ThemedYStack,
  type ThemedYStackProps,
} from "@/components/ui/themed/ThemedStacks";

export const Loader = ({ ...props }: ThemedYStackProps) => {
  return (
    <ThemedYStack
      f={1}
      jc="center"
      ai="center"
      theme="tertiary_shade"
      {...props}
    >
      <ThemedSpinner size="large" theme="tertiary" color="$background" />
      <AnimalIcon size="$1" col="$background" />
    </ThemedYStack>
  );
};
