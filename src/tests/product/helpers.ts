import fs from "fs";
import path from "path";

import type { ProductData } from "@/types";

export function loadFixture(name: string): ProductData {
  const p = path.join(__dirname, "__fixtures__", name);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
