import { tokens } from "@tamagui/config/v4";
import { getVariableValue } from "tamagui";

import appConfig from "@/tamagui/tamagui.config";

export function spacePx(token: string | number) {
  const key =
    typeof token === "string" && token.startsWith("$")
      ? token.slice(1)
      : String(token);

  const candidate =
    // try "$2", then "2", then 2
    (tokens.space as any)[`$${key}`] ??
    (tokens.space as any)[key] ??
    (tokens.space as any)[Number(key)];

  return Math.round(Number(getVariableValue(candidate ?? 0)));
}

export function resolveThemeToken(
  themeName: string,
  token: string = "background"
): string {
  const themeObj: any = (appConfig as any).themes?.["light_" + themeName];

  if (!themeObj) {
    if (__DEV__)
      console.warn(`[resolveThemeToken] theme not found: ${themeName}`);
    return "";
  }
  const v = themeObj[token];
  return String(getVariableValue(v));
}
