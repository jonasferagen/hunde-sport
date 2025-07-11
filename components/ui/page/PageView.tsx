
import { AppStyles } from '@/styles/AppStyles';
import { View } from 'react-native';

export default function PageView({ children }: { children: React.ReactNode }) {
  return (
    <View style={AppStyles.pageView}>
      {children}
    </View>
  );
}
