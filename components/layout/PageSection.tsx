import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

type PageSectionProps = {
  children: React.ReactNode;
  primary?: boolean;
  style?: ViewStyle;
  scrollable?: boolean;
};

export function PageSection({ children, primary = false, style, scrollable }: PageSectionProps) {

  const type = primary ? 'primary' : 'secondary';

  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={[styles.scrollContentContainer, styles[type], style]}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
      >
        {children}
      </ScrollView>
    );
  }

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
  scrollContentContainer: {
    paddingBottom: SPACING.lg, // Add some padding at the bottom
  },
  primary: {
    backgroundColor: COLORS.backgroundPrimary,
  },
  secondary: {
    backgroundColor: COLORS.backgroundSecondary,
    borderColor: COLORS.border,
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
});
