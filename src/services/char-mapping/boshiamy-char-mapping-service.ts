import { from, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { CharMappingDict } from '@interfaces/char-mapping';

export function loadCharMappingFromBoshiamy(): Observable<CharMappingDict> {
  return fetchCharMappingFromBoshiamy().pipe(delay(500), map(resolveTableCharMapping));
}

function fetchCharMappingFromBoshiamy(): Observable<string> {
  return from(fetch('/hliu/liu-uni.js').then((response) => response.text()));
}

function resolveTableCharMapping(text: string): CharMappingDict {
  const [tableIndexVar, tableWordVar] = text.split('\n');
  const tableIndex = parseJsArray<number>(tableIndexVar);
  const tableWord = parseJsArray<string>(tableWordVar);
  return tableIndexToMappingDict(tableIndex, tableWord);
}

function tableIndexToMappingDict(tableIndex: number[][], tableWord: string[][]): CharMappingDict {
  const charMappingDict: CharMappingDict = {};

  for (let firstTwoIndex = 0; firstTwoIndex < tableIndex.length; firstTwoIndex += 1) {
    const wordIndexArray = tableIndex[firstTwoIndex];
    if (!wordIndexArray.length) {
      continue;
    }

    const codeFromFirstIndex = convert32BasedCode(firstTwoIndex);
    for (let wordIndex = 0; wordIndex < wordIndexArray.length; wordIndex += 1) {
      const lastTwoIndex = wordIndexArray[wordIndex];
      const codeFromLastIndex = convert32BasedCode(lastTwoIndex);
      const code = codeFromFirstIndex + codeFromLastIndex;
      charMappingDict[code] = tableWord[firstTwoIndex][wordIndex].split('');
    }
  }

  return charMappingDict;
}

function convert32BasedCode(numberIn32Based: number): string {
  const codeChars = "abcdefghijklmnopqrstuvwxyz,.'[]";
  // eslint-disable-next-line no-bitwise
  return (codeChars[(numberIn32Based >> 5) - 1] || '') + (codeChars[(numberIn32Based & 0x1f) - 1] || '');
}

function parseJsArray<T>(arrayVarString: string): T[][] {
  const [, array] = arrayVarString.split('=');
  const arrayContent = array.replace(';', '');
  return JSON.parse(arrayContent);
}
