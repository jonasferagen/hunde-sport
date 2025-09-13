import { X } from "@tamagui/lucide-icons";
import * as React from "react";
import { H4, ScrollView, type ScrollViewProps } from "tamagui";

import { ThemedButton, ThemedXStack, ThemedYStack } from "@/components/ui/themed";

type ModalLayoutProps = {
  /** Header title area (text or custom node) */
  title?: React.ReactNode;
  /** Called when the close button is pressed */
  onClose: () => void;

  /** Main content */
  children: React.ReactNode;

  /** Optional footer area (e.g. actions) */
  footer?: React.ReactNode;

  /** Wrap body in a ScrollView (default true) */
  scroll?: boolean;

  /** Props passed to ScrollView when scroll=true */
  scrollProps?: Omit<ScrollViewProps, "children">;
};

/**
 * Minimal, opinionated modal layout:
 * Header (title + close), Body (scrollable by default), Footer (actions)
 */
export function ModalLayout({ title, onClose, children, footer, scroll = true, scrollProps }: ModalLayoutProps) {
  return (
    <ThemedYStack f={1} mih={0} gap="$3" p="$2">
      {/* Header */}
      <ThemedXStack ai="center">
        <H4 f={1} fow="bold" numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8} ellipsizeMode="tail">
          {title}
        </H4>

        <ThemedButton ml="auto" circular onPress={onClose} aria-label="Close">
          <X />
        </ThemedButton>
      </ThemedXStack>

      {/* Body */}
      <ThemedYStack f={1} mih={0}>
        {scroll ? (
          <ScrollView f={1} keyboardShouldPersistTaps="handled" removeClippedSubviews={false} contentContainerStyle={{ paddingBottom: 12 }} {...scrollProps}>
            {children}
          </ScrollView>
        ) : (
          <ThemedYStack f={1} mih={0}>
            {children}
          </ThemedYStack>
        )}
      </ThemedYStack>

      {/* Footer */}
      {footer ? <ThemedYStack>{footer}</ThemedYStack> : null}
    </ThemedYStack>
  );
}
