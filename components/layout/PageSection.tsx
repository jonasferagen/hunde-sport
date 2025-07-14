import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

type PageSectionProps = {
  children: React.ReactNode;
  primary?: boolean;
  style?: ViewStyle;
  flex?: boolean;
  scrollable?: boolean;
};

export const PageSection = ({ children, primary = false, style, flex, scrollable }: PageSectionProps) => {

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
    <View style={[styles.container, flex && styles.flexContainer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  flexContainer: {
    flex: 1,
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
