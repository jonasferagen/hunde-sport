import { View } from 'react-native';

export default function PageView({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
}
