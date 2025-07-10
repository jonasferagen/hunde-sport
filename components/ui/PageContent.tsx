import { AppStyles } from '@/styles/AppStyles';
import { ScrollView } from 'react-native';

export default function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      contentContainerStyle={AppStyles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}