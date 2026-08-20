/**
 * Tiny deterministic PRNG (Mulberry32). Same seed → same sequence.
 * Used by the mock market-data provider so the dashboard does not flicker
 * between SSR and client hydration.
 */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return function next() {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** String → 32-bit hash, used to derive a stable seed from a symbol/date. */
export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
