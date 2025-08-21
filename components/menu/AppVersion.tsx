import Constants from "expo-constants";
import { ThemedText, ThemedXStack } from "../ui";

export const AppVersion = () => {
  const version = Constants.expoConfig?.version;
  const build = Constants.expoConfig?.android?.versionCode; // iOS: ios.buildNumber

  return (
    <ThemedXStack container>
      <ThemedText size="$1" >
        v{version} (build {build})
      </ThemedText>
    </ThemedXStack>
  );
};
