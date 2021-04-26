import { BehaviorSubject, Subject } from 'rxjs';
import { bufferCount, filter, shareReplay } from 'rxjs/operators';

import { CharMappingDict } from '@interfaces/char-mapping';
import { isComposing } from '@utils/key-event-utils';

export interface MatchResult {
  typingCode: string;
  charSelections: string[];
  page: number;
  totalPages: number;
}

export const emptyMatchResult = Object.freeze({
  typingCode: '',
  charSelections: [],
  page: 0,
  totalPages: 0,
});

export class CodeMatcher {
  private readonly pageSize = 10;
  private readonly pageUpKeys = Object.freeze(['PageUp', 'ArrowUp']);
  private readonly pageDownKeys = Object.freeze(['PageDown', 'ArrowDown']);

  private typingCode$$ = new BehaviorSubject<string>('');
  private matchResult$$ = new BehaviorSubject<MatchResult>(emptyMatchResult);
  private matchedChars$$ = new BehaviorSubject<string[]>([]);
  private char$$ = new Subject<string>();
  private cancel$$ = new Subject<void>();

  typingCode$ = this.typingCode$$.asObservable();
  matchResult$ = this.matchResult$$.asObservable();
  char$ = this.char$$.asObservable();
  cancel$ = this.cancel$$.asObservable();
  startTypingCode$ = this.typingCode$$.pipe(
    bufferCount(2, 1),
    filter(([lastCode, currentCode]) => !lastCode && !!currentCode),
    shareReplay(1),
  );
  stopTypingCode$ = this.typingCode$$.pipe(
    bufferCount(2, 1),
    filter(([lastCode, currentCode]) => !!lastCode && !currentCode),
  );

  page = emptyMatchResult.page;
  totalPages = emptyMatchResult.totalPages;

  constructor(private readonly charMappingDict: CharMappingDict) {}

  onKeyDown(event: KeyboardEvent): void {
    if (event.metaKey || event.shiftKey || isComposing(event)) {
      return;
    }

    const inputKey = event.key;
    if (inputKey.match(/^[a-z,.'[\]]$/)) {
      this.onTypingCode(event);
    } else if (inputKey === 'Backspace') {
      this.handleBackspace(event);
    } else if (inputKey === 'Escape') {
      this.handleCancelInput(event);
    } else if (this.pageUpKeys.includes(inputKey) || this.pageDownKeys.includes(inputKey)) {
      this.handlePage(event);
    } else if (inputKey === ' ') {
      this.recognizeInput(event);
    } else if (inputKey.match(/\d/)) {
      this.sendMatchedChar(event);
    }
  }

  clear(): void {
    this.typingCode$$.next('');
    this.matchedChars$$.next([]);
    this.matchResult$$.next(emptyMatchResult);
  }

  private onTypingCode(event: KeyboardEvent): void {
    if (this.typingCode$$.value.length < 5) {
      this.typingCode$$.next(this.typingCode$$.value + event.key);
      this.updateMatchedChars();
    }
    event.preventDefault();
  }

  private updateMatchedChars(): void {
    const typingCode = this.typingCode$$.value;
    const matchedChars = this.charMappingDict[typingCode] || [];
    this.matchedChars$$.next(matchedChars);
    this.page = 0;
    this.updateMatchResult();
  }

  private updateMatchResult(): void {
    const matchedChars = this.matchedChars$$.value;
    const charSelections = matchedChars.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
    this.matchResult$$.next({
      typingCode: this.typingCode$$.value,
      charSelections,
      page: this.page,
      totalPages: this.totalPages,
    });
    this.totalPages = Math.ceil(matchedChars.length / this.pageSize);
  }

  private handleBackspace(event: KeyboardEvent): void {
    const typingCode = this.typingCode$$.value;
    if (!typingCode.length) {
      return;
    }

    this.typingCode$$.next(typingCode.substring(0, typingCode.length - 1));
    this.updateMatchedChars();
    event.preventDefault();
  }

  private handleCancelInput(event: KeyboardEvent): void {
    this.cancel$$.next();
    this.clear();
    event.preventDefault();
  }

  private handlePage(event: KeyboardEvent): void {
    if (this.pageDownKeys.includes(event.key)) {
      this.page = Math.min(this.totalPages - 1, this.page + 1);
      this.updateMatchResult();
      event.preventDefault();
    } else if (this.pageUpKeys.includes(event.key)) {
      this.page = Math.max(0, this.page - 1);
      this.updateMatchResult();
      event.preventDefault();
    }
  }

  private recognizeInput(event: KeyboardEvent): void {
    const firstMatch = this.matchedChars$$.value[0];
    if (firstMatch) {
      this.char$$.next(firstMatch);
    } else {
      this.cancel$$.next();
    }
    if (firstMatch || this.typingCode$$.value) {
      this.clear();
      event.preventDefault();
    }
  }

  private sendMatchedChar(event: KeyboardEvent): void {
    const index = parseInt(event.key, 10) + this.page * this.pageSize;
    const char = this.matchedChars$$.value[index];
    if (char) {
      this.char$$.next(char);
      this.clear();
      event.preventDefault();
    }
  }
}
