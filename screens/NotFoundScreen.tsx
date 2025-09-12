import { Button, H1 } from "tamagui";

import { ThemedYStack } from "@/components/ui/themed-components";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";

interface NotFoundScreenProps {
  message?: string;
}
 
export const NotFoundScreen = ({
  message = "Siden ble ikke funnet.",
}: NotFoundScreenProps) => {
  const { to } = useCanonicalNavigation();
  return (
    <ThemedYStack flex={1} jc="center" ai="center" gap="$4">
      <H1 lineHeight={40} padding="$5" flex={0}>
        {message}
      </H1>
      <Button onPress={() => to("index")}>Gå tilbake til forsiden</Button>
    </ThemedYStack>
  );
};
