import { Button, H1, YStack } from "tamagui";

import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";

interface NotFoundScreenProps {
  message?: string;
}

export const NotFoundScreen = ({
  message = "Siden ble ikke funnet.",
}: NotFoundScreenProps) => {
  const { to } = useCanonicalNavigation();
  return (
    <YStack flex={1} jc="center" ai="center" gap="$4">
      <H1 lineHeight={40} padding="$5" flex={0}>
        {message}
      </H1>
      <Button onPress={() => to("index")}>Gå tilbake til forsiden</Button>
    </YStack>
  );
};
