// lib/smartExpoStorage.ts
import { Storage } from "expo-storage";

export function createSmartExpoStorage() {
  const last = new Map<string, string | null>();

  return {
    getItem: async (name: string) => {
      const v = await Storage.getItem({ key: name });
      last.set(name, v);
      return v;
    },
    setItem: async (name: string, value: string) => {
      if (last.get(name) === value) return;
      last.set(name, value);
      await Storage.setItem({ key: name, value });
    },
    removeItem: async (name: string) => {
      last.delete(name);
      await Storage.removeItem({ key: name });
    },
  };
}
