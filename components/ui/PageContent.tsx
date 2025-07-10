
import { AppStyles } from '@/styles/AppStyles';
import { View } from 'react-native';

export default function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <View style={AppStyles.pageContent}>
      {children}
    </View>
  );
}