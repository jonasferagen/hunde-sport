import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

interface PageSectionProps {
  children: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
  accent?: boolean;
  style?: ViewStyle;
  flex?: boolean;
  scrollable?: boolean;
};

export const PageSection = ({ children, primary = false, secondary = false, accent = false, style, flex, scrollable }: PageSectionProps) => {

  const type = primary ? 'primary' : secondary ? 'secondary' : accent ? 'accent' : 'secondary';

  const mergedStyles = [styles[type], style];

  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={[styles.scrollContentContainer, ...mergedStyles]}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[flex && styles.flexContainer, styles.container, ...mergedStyles]}>
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

  primary: {
    backgroundColor: COLORS.backgroundPrimary,
    borderColor: COLORS.backgroundPrimaryBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
  secondary: {
    backgroundColor: COLORS.backgroundSecondary,
    borderColor: COLORS.backgroundSecondaryBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
  accent: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.backgroundAccentBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
});
