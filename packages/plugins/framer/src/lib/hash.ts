/**
 * FNV-1a, 32-bit. Not cryptographic — this only has to answer "did the content
 * we write to the CMS change?", where a collision costs one redundant write.
 */
export function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    // hash *= 16777619, kept in 32-bit range without overflowing to a double.
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}
