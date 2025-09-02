import * as SplashScreen from "expo-splash-screen";

import data from "@/tests/product/__fixtures__/variable-attr-double.json";

import { parse } from "./temp/parse";
SplashScreen.preventAutoHideAsync().catch(() => {});

/** -------------------- Screen -------------------- **/

export const TestScreen = () => {
  const maps = parse(data);
  const { vmap, amap, tmap } = maps;

  const t_v = new Map<string, Set<string>>();
  const v_t = new Map<string, Set<string>>();
  const a_t = new Map<string, Set<string>>();
  const t_a = new Map<string, Set<string>>();
  const a_v = new Map<string, Set<string>>();
  const v_a = new Map<string, Set<string>>();

  // Build term ↔ attribute mappings
  for (const t of [...tmap.values()]) {
    const { key: tKey, attrKey: aKey } = t;
    addToSetMap(t_a, tKey, aKey);
    addToSetMap(a_t, aKey, tKey);
  }

  // Build variation ↔ term and variation ↔ attribute mappings
  for (const v of [...vmap.values()]) {
    const { key: vKey, termKeys, attrKeys } = v;

    for (const tKey of termKeys) {
      addToSetMap(v_t, vKey, tKey);
      addToSetMap(t_v, tKey, vKey);
    }

    for (const aKey of attrKeys) {
      addToSetMap(v_a, vKey, aKey);
      addToSetMap(a_v, aKey, vKey);
    }
  }
};

function addToSetMap(
  map: Map<string, Set<string>>,
  key: string,
  value: string
) {
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  map.get(key)!.add(value);
}
