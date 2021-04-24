import * as R from 'ramda';

import { CharMapping, CharMappingDict } from '@interfaces/char-mapping';

import { resolveCinCharMapping } from './cin-char-mapping-resolver';

export function appendUserDict(charMappingDict: CharMappingDict): CharMappingDict {
  const userDictMappings = getUserDict();

  const newCharMappingDict = {} as CharMappingDict;
  userDictMappings?.forEach((charMapping) => {
    newCharMappingDict[charMapping.code] = [
      ...(newCharMappingDict[charMapping.code] || charMappingDict[charMapping.code] || []),
      charMapping.char,
    ];
  });

  return { ...charMappingDict, ...newCharMappingDict };
}

export function getUserDict(): CharMapping[] | null {
  return getUserDictFromUrl() || getUserDictFromLocalStorage();
}

function getUserDictFromUrl(): CharMapping[] | null {
  const userDictBase64 = new URL(window.location.href).searchParams.get('userDict');
  if (!userDictBase64) {
    return null;
  }
  return base64ToCharMappings(userDictBase64);
}

export function getUserDictAsBase64String(): string | null {
  const userDict = getUserDictFromLocalStorage();
  return userDict ? charMappingsToBase64(userDict) : null;
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
          .map(({ code, char }) => ({ code: code.trim(), char: char.trim() })),
      ),
    );
  } else {
    localStorage.removeItem('user-dict');
  }
}

function charMappingsToBase64(charMappings: CharMapping[]): string {
  return R.pipe(stringifyCharMappings, encodeURIComponent, btoa)(charMappings);
}

function base64ToCharMappings(base64String: string): CharMapping[] {
  return R.pipe(atob, decodeURIComponent, resolveCinCharMapping)(base64String);
}

function stringifyCharMappings(charMappings: CharMapping[]): string {
  return charMappings.map((charMapping) => `${charMapping.code}\t${charMapping.char}`).join('\n');
}
