import { AppStyles } from '@/styles/AppStyles';
import { StyleSheet, View, ViewStyle } from 'react-native';

type PageSectionProps = {
  children: React.ReactNode;
  type?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export default function PageSection({ children, type = 'primary', style }: PageSectionProps) {
  return (
    <View style={[AppStyles.pageSection, styles[type], style]}>
      {children}
    </View>
  );
}

import { COLORS } from '@/styles/Colors';

const styles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.backgroundPrimary,
  },
  secondary: {
    backgroundColor: COLORS.backgroundSecondary,
  },
});
