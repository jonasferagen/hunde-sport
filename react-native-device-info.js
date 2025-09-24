import Constants from "expo-constants";

export const getBundleId = () =>
  Constants.expoConfig?.ios?.bundleIdentifier ?? "";

export const getVersion = () => Constants.expoConfig?.version ?? "0.0.0";

export default { getBundleId, getVersion };
