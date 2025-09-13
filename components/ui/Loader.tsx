import { ThemedSpinner } from "@/components/ui/themed/ThemedSpinner";
import { ThemedYStack, type ThemedYStackProps } from "@/components/ui/themed/ThemedStacks";

export const Loader = ({ ...props }: ThemedYStackProps) => {
  return (
    <ThemedYStack f={1} jc="center" ai="center" {...props}>
      <ThemedSpinner size="small" />
    </ThemedYStack>
  );
};
