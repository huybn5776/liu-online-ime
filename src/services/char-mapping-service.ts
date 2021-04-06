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
    map((charMappingDict) => appendUserDict(charMappingDict)),
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

function appendUserDict(charMappingDict: CharMappingDict): CharMappingDict {
  const userDictMappings = getUserDictFromLocalStorage();

  const newCharMappingDict = {} as CharMappingDict;
  userDictMappings?.forEach((charMapping) => {
    newCharMappingDict[charMapping.code] = [
      ...(newCharMappingDict[charMapping.code] || charMappingDict[charMapping.code] || []),
      charMapping.char,
    ];
  });

  return { ...charMappingDict, ...newCharMappingDict };
}

export function getUserDictFromLocalStorage(): CharMapping[] | null {
  const userDictJson = localStorage.getItem('user-dict');
  return userDictJson ? (JSON.parse(userDictJson) as CharMapping[]) : null;
}

export function saveUserDictToLocalStorage(userDict: CharMapping[] | undefined | null): void {
  if (userDict) {
    localStorage.setItem(
      'user-dict',
      JSON.stringify(
        userDict
          .filter((charMapping) => charMapping.code && charMapping.char)
          .map(({ code, char }) => ({ code, char })),
      ),
    );
  } else {
    localStorage.removeItem('user-dict');
  }
}
