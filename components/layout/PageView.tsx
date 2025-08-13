import { YStack, YStackProps } from 'tamagui';
export const PageView = ({ children, ...stackProps }: YStackProps) =>

  <YStack theme="neutral_soft" bbw={1} boc="$borderColor" f={1} {...stackProps}>
    {children}
  </YStack>
