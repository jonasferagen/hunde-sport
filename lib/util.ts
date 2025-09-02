// @/lib/util.ts

export function intersectSets<T>(...sets: ReadonlySet<T>[]): ReadonlySet<T> {
  if (sets.length === 0) return new Set<T>();
  if (sets.length === 1) return sets[0]!;

  // start from the smallest set to minimize work
  const sorted = [...sets].sort((a, b) => a.size - b.size);
  let acc = new Set<T>(sorted[0]!);

  for (const next of sorted.slice(1)) {
    const newAcc = new Set<T>();
    for (const val of acc) {
      if (next.has(val)) newAcc.add(val);
    }
    if (newAcc.size === 0) return newAcc; // short-circuit
    acc = newAcc;
  }

  return acc;
}

export const freezeMap = <K, V>(m: Map<K, V>): ReadonlyMap<K, V> =>
  new Map(m) as ReadonlyMap<K, V>;

export const freezeSet = <T>(s: Set<T>): ReadonlySet<T> =>
  new Set(s) as ReadonlySet<T>;
