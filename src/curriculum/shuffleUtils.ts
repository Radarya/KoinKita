function hashSeed(input: string | number): number {
  const str = String(input);
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffleArray<T>(items: readonly T[], seedKey: string | number): T[] {
  const copy = [...items];
  const rng = mulberry32(hashSeed(seedKey));
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

export function shuffleOptionsKeepingAnswer(
  options: readonly string[],
  correctIndex: number,
  seedKey: string | number
): { options: string[]; correctIndex: number } {
  const tagged = options.map((text, idx) => ({
    text,
    isCorrect: idx === correctIndex,
  }));
  const shuffled = seededShuffleArray(tagged, seedKey);
  return {
    options: shuffled.map((x) => x.text),
    correctIndex: Math.max(0, shuffled.findIndex((x) => x.isCorrect)),
  };
}
