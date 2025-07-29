import { Theme, YStack } from 'tamagui';
export const PageView = ({ children }: { children: React.ReactNode }) =>
  <Theme name='light'>

    <YStack flex={1} >
      {children}
    </YStack>

  </Theme>
