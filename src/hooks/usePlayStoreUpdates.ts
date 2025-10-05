// usePlayStoreUpdates.ts  (now works for iOS too)
import Constants from "expo-constants";
import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import SpInAppUpdates, {
  IAUUpdateKind,
  type StartUpdateOptions,
} from "sp-react-native-in-app-updates";

type InAppUpdatesOptions = {
  checkOnStart?: boolean;
  checkOnForeground?: boolean;
  immediate?: boolean; // IMMEDIATE helps verify quickly
  cooldownMs?: number;
  startDelayMs?: number; // avoid racing Play right on cold start
  onChecked?: (didPromptBoolean: boolean) => void; // optional debug
};

/** Checks store and prompts user for a native update when available. */
export function usePlayStoreUpdates({
  checkOnStart = true,
  checkOnForeground = true,
  immediate = false,
  cooldownMs = 60_000,
  startDelayMs = 1_500,
  onChecked,
}: InAppUpdatesOptions = {}): void {
  const lastCheckEpochMsRef = useRef(0);

  useEffect(() => {
    const androidPackageNameString = Constants?.expoConfig?.android?.package;
    const iosBundleIdString = Constants?.expoConfig?.ios?.bundleIdentifier;
    const appVersionString = Constants?.expoConfig?.version ?? "0.0.0";

    // Skip sideload/dev variant and debug builds (Play Core won’t work on debug).
    if (Platform.OS === "android") {
      if (!androidPackageNameString) return;
      if (androidPackageNameString.endsWith(".dev") || __DEV__) return;
    }

    let isMountedBoolean = true;
    const inAppUpdates = new SpInAppUpdates(false); // isDebug=false

    const doCheck = async () => {
      const now = Date.now();
      if (!isMountedBoolean || now - lastCheckEpochMsRef.current < cooldownMs)
        return;
      lastCheckEpochMsRef.current = now;

      try {
        // Pass version explicitly so we don’t depend on react-native-device-info in Expo.
        const needsUpdate = await inAppUpdates.checkNeedsUpdate({
          curVersion: appVersionString,
        });
        if (!needsUpdate?.shouldUpdate) {
          onChecked?.(false);
          return;
        }

        const startUpdateOptions: StartUpdateOptions =
          Platform.select<StartUpdateOptions>({
            android: {
              updateType: immediate
                ? IAUUpdateKind.IMMEDIATE
                : IAUUpdateKind.FLEXIBLE,
            },
            ios: {
              title: "Update available",
              message: "A new version is available on the App Store.",
              buttonUpgradeText: "Update",
              buttonCancelText: "Not now",
              // Provide bundleId explicitly; avoids device-info dependency.
              bundleId: iosBundleIdString,
            },
          })!;

        await inAppUpdates.startUpdate(startUpdateOptions);
        onChecked?.(true); // flow started (dialog/snackbar shown)
      } catch {
        // Common causes: not installed from Play/App Store, no update, or API not ready yet.
        onChecked?.(false);
      }
    };

    if (checkOnStart) {
      const t = setTimeout(doCheck, startDelayMs);
      return () => {
        isMountedBoolean = false;
        clearTimeout(t);
      };
    }

    return () => {
      isMountedBoolean = false;
    };
  }, [checkOnStart, cooldownMs, immediate, startDelayMs, onChecked]);

  useEffect(() => {
    if (!checkOnForeground) return;
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        // allow an immediate re-check when app returns to foreground
        lastCheckEpochMsRef.current = Math.max(0, Date.now() - cooldownMs - 1);
      }
    });
    return () => sub.remove();
  }, [checkOnForeground, cooldownMs]);
}
