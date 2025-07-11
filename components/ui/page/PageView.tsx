
import { View } from 'react-native';

export default function PageView({ children }: { children: React.ReactNode }) {
  return (
    <View>
      {children}
    </View>
  );
}
