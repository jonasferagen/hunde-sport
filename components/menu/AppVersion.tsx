import * as Application from 'expo-application';

import { ThemedText, ThemedXStack } from "../ui";
export const AppVersion = () => {
  const version = Application.nativeApplicationVersion ?? '?.?'; // versionName / CFBundleShortVersionString
  const build = Application.nativeBuildVersion ?? 'N/A';         // versionCode / CFBundleVersion

  return (
    <ThemedXStack container ai="center" jc="flex-end" boc="black" bw={1}>
      <ThemedText size="$1" >
        v{version} (build {build})
      </ThemedText>
    </ThemedXStack>
  );
};
