import { EMPTY, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CharMapping, CharMappingDict } from '../interfaces/char-mapping';

export function loadCharMappings(): Observable<CharMappingDict> {
  const source = fetchCharMappingFromUrlParams();
  if (!source) {
    return EMPTY;
  }

  return source.pipe(
    map((text) => resolveCharMapping(text)),
    map(charMappingsToDict),
  );
}

function fetchCharMappingFromUrlParams(): Observable<string> | null {
  const cinUrlString = new URL(window.location.href).searchParams.get('cin');

  let cinUrl = null;
  try {
    cinUrl = cinUrlString && new URL(cinUrlString);
  } catch (e) {
    return null;
  }
  if (!cinUrl || !['http:', 'https:'].includes(cinUrl.protocol)) {
    return null;
  }

  return from(fetch(cinUrl.href).then((response) => response.text()));
}

function resolveCharMapping(text: string): CharMapping[] {
  return text
    .split('\n')
    .filter((row) => !row.startsWith('%') && !row.startsWith('#'))
    .map((row) => row.split('\t'))
    .filter((charMapping) => charMapping.length === 2)
    .map((charMapping) => ({ code: charMapping[0].trim(), char: charMapping[1].trim() } as CharMapping));
}

function charMappingsToDict(charMappings: CharMapping[]): CharMappingDict {
  const charMappingDict = {} as CharMappingDict;
  charMappings.forEach((charMapping) => {
    charMappingDict[charMapping.code] = [...(charMappingDict[charMapping.code] || []), charMapping.char];
  });
  return charMappingDict;
}
