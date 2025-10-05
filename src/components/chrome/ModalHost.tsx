// ModalHost.tsx
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sheet } from "tamagui";
import { useShallow } from "zustand/react/shallow";

import { ThemedLinearGradient, ThemedYStack } from "@/components/ui/themed";
import { THEME_SHEET, THEME_SHEET_BG1, THEME_SHEET_BG2 } from "@/config/app";
import { AppToastProvider } from "@/contexts";
import { useModalSettled } from "@/hooks/ui/useModalSettled";
import { resolveThemeToken } from "@/lib/theme";
import { setModalPosition, useModalStore } from "@/stores/ui/modalStore";

const sheetOverlayEnterStyle = { opacity: 0 };

export const ModalHost = () => {
  // ...
  const { open, renderer, payload, snapPoints, position, closeModal, status } =
    useModalStore(
      useShallow((s) => ({
        open: s.open,
        renderer: s.renderer,
        payload: s.payload,
        snapPoints: s.snapPoints,
        position: s.position,
        closeModal: s.closeModal,
        status: s.status,
      })),
    );

  const { onHostLayout } = useModalSettled();
  const body =
    status === "closed"
      ? null
      : renderer?.(payload, {
          close: () => closeModal(),
          setPosition: setModalPosition,
        });

  const insets = useSafeAreaInsets();

  const onOpenChange = React.useCallback(
    (o: boolean) => {
      if (!o) closeModal();
    },
    [closeModal],
  );
  const c1 = resolveThemeToken(THEME_SHEET_BG1, "background");
  const c2 = resolveThemeToken(THEME_SHEET_BG2, "background");

  return (
    <Sheet
      modal
      native
      open={open}
      onOpenChange={onOpenChange}
      snapPointsMode="percent"
      snapPoints={snapPoints} // e.g. [85]
      position={position}
      onPositionChange={setModalPosition}
      unmountChildrenWhenHidden
      dismissOnSnapToBottom
      animation="spring"
    >
      <Sheet.Overlay
        bg="black"
        o={0.15}
        animation="spring"
        enterStyle={sheetOverlayEnterStyle}
      />
      <Sheet.Handle />
      <Sheet.Frame
        f={1}
        p="$4"
        gap="$3"
        mih={0}
        mb={insets.bottom}
        onLayout={onHostLayout}
        theme={THEME_SHEET}
      >
        <ThemedLinearGradient fromColor={c1} toColor={c2} alpha={1} />
        <ThemedYStack f={1} mih={0}>
          <AppToastProvider>{body}</AppToastProvider>
        </ThemedYStack>
      </Sheet.Frame>
    </Sheet>
  );
};
//
