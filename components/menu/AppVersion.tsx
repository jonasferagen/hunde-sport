import Constants from "expo-constants";
import { ThemedText, ThemedXStack } from "../ui";

export const AppVersion = () => {
  const version = Constants.expoConfig?.version;
  const build = Constants.expoConfig?.android?.versionCode || "N/A";

  return (
    <ThemedXStack container ai="center" jc="flex-end">
      <ThemedText size="$1" >
        v{version} (build {build})
      </ThemedText>
    </ThemedXStack>
  );
};
