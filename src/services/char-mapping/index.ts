import { EMPTY, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CharMappingDict } from '../../interfaces/char-mapping';
import { loadCharMappingFromBoshiamy } from './boshiamy-char-mapping-service';
import { loadCinCharMapping } from './cin-char-mapping-service';
import { appendUserDict } from './user-dict-char-mapping-service';

const lazyCharMappingDict: () => Observable<CharMappingDict> = (() => {
  let loadedCharMappingDict: CharMappingDict | null = null;

  const load: () => Observable<CharMappingDict> = () => {
    return loadCinCharMapping() || loadCharMappingFromBoshiamy() || EMPTY;
  };

  return () => {
    if (loadedCharMappingDict) {
      return of(loadedCharMappingDict);
    }

    return load().pipe(
      tap((charMappingDict) => {
        loadedCharMappingDict = charMappingDict;
      }),
    );
  };
})();

export function loadCharMappings(): Observable<CharMappingDict> {
  return lazyCharMappingDict().pipe(map(appendUserDict));
}
