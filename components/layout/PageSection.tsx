import { useTheme } from '@/contexts';
import { PageSectionProvider } from '@/contexts/PageSectionContext';
import { SPACING } from '@/styles/Dimensions';
import { Theme } from '@/styles/Theme';
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
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const type = primary ? 'primary' : secondary ? 'secondary' : accent ? 'accent' : 'secondary';

  const mergedStyles = [styles[type], style];

  const content = (
    <PageSectionProvider value={{ sectionType: type }}>
      {children}
    </PageSectionProvider>
  );

  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={[styles.scrollContentContainer, ...mergedStyles]}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        scrollsToTop={true}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View style={[flex ? styles.flexContainer : styles.container, ...mergedStyles]}>
      {content}
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  flexContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    // Add any specific styles for scrollable content here
  },
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.gradients.primary[0],
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.gradients.secondary[0],
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
  accent: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.gradients.accent[0],
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
});
