import { CharMapping } from '../../interfaces/char-mapping';

export function resolveCinCharMapping(text: string): CharMapping[] {
  return text
    .split('\n')
    .filter((row) => !row.startsWith('%') && !row.startsWith('#'))
    .map((row) => row.split('\t'))
    .filter((charMapping) => charMapping.length === 2)
    .map((charMapping) => ({ code: charMapping[0].trim(), char: charMapping[1].trim() } as CharMapping));
}
