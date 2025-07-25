import { Theme, YStack } from 'tamagui';
import { StatusMessage } from '../ui/statusMessage/StatusMessage';
export const PageView = ({ children }: { children: React.ReactNode }) => {
  return (
    <Theme name="light">
      <YStack flex={1}>
        {children}
        <StatusMessage />
      </YStack>
    </Theme>
  );
};
