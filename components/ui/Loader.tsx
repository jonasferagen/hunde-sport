import { ThemedSpinner } from "@/components/ui/themed-components/ThemedSpinner";
import {
  ThemedYStack,
  type ThemedYStackProps,
} from "@/components/ui/themed-components/ThemedStacks";

export const Loader = ({ ...props }: ThemedYStackProps) => {
  return (
    <ThemedYStack f={1} jc="center" ai="center" {...props}>
      <ThemedSpinner size="small" />
    </ThemedYStack>
  );
};
