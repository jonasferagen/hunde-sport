import { YStack } from 'tamagui';
export const PageView = ({ children }: { children: React.ReactNode }) =>
  <YStack flex={1}>
    {children}
  </YStack>
