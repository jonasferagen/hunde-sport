import { View } from 'react-native';
import { StatusMessage } from '../ui/statusmessage/StatusMessage';

export const PageView = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <StatusMessage />
    </View>
  );
};
