import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CharMapping, CharMappingDict } from '@interfaces/char-mapping';

import { resolveCinCharMapping } from './cin-char-mapping-resolver';

export function loadCinCharMapping(): Observable<CharMappingDict> | null {
  return fetchCharMappingFromUrlParams()?.pipe(
    map((text) => resolveCinCharMapping(text)),
    map(charMappingsToDict),
  ) || null;
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

function charMappingsToDict(charMappings: CharMapping[]): CharMappingDict {
  const charMappingDict = {} as CharMappingDict;
  charMappings.forEach((charMapping) => {
    charMappingDict[charMapping.code] = [...(charMappingDict[charMapping.code] || []), charMapping.char];
  });
  return charMappingDict;
}

