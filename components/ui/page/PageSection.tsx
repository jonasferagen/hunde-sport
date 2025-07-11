import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { StyleSheet, View, ViewStyle } from 'react-native';

type PageSectionProps = {
  children: React.ReactNode;
  type?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export default function PageSection({ children, type = 'primary', style }: PageSectionProps) {
  return (
    <View style={[styles.container, styles[type], style]}>
      {children}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  primary: {
    backgroundColor: COLORS.backgroundPrimary,
  },
  secondary: {
    backgroundColor: COLORS.backgroundSecondary,
    borderColor: COLORS.border,
    borderBottomWidth: 1,
  },
});
