// ModalHost.tsx
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sheet } from "tamagui";
import { useShallow } from "zustand/react/shallow";

import { ThemedLinearGradient, ThemedYStack } from "@/components/ui/themed";
import { THEME_SHEET, THEME_SHEET_BG1, THEME_SHEET_BG2 } from "@/config/app";
import { AppToastProvider } from "@/contexts";
import { useModalSettled } from "@/hooks/ui/useModalSettled";
import { resolveThemeToken } from "@/lib/theme";
import { setModalPosition, useModalStore } from "@/stores/ui/modalStore";

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

  const c1 = resolveThemeToken(THEME_SHEET_BG1, "background");
  const c2 = resolveThemeToken(THEME_SHEET_BG2, "background");
  return (
    <Sheet
      modal
      native
      open={open}
      onOpenChange={(o: boolean) => {
        if (!o) closeModal();
      }}
      snapPointsMode="percent"
      snapPoints={snapPoints} // e.g. [85]
      position={position}
      onPositionChange={setModalPosition}
      unmountChildrenWhenHidden
      dismissOnSnapToBottom
      animation="spring"
    >
      <Sheet.Overlay
        animation="spring"
        enterStyle={{ opacity: 0 }}
        style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        f={1}
        mih={0}
        p="$4"
        mb={insets.bottom}
        gap="$3"
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
