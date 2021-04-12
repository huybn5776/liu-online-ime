import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CharMappingDict } from '../../interfaces/char-mapping';
import { loadCharMappingFromBoshiamy } from './boshiamy-char-mapping-service';
import { loadCinCharMapping } from './cin-char-mapping-service';
import { appendUserDict } from './user-dict-char-mapping-service';

export function loadCharMappings(): Observable<CharMappingDict> {
  const source = loadCinCharMapping() || loadCharMappingFromBoshiamy();
  if (source) {
    return source.pipe(map(appendUserDict));
  }
  return EMPTY;
}
