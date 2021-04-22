import React from 'react';

import { BehaviorSubject, Subject } from 'rxjs';
import { bufferCount, distinctUntilChanged, filter, shareReplay } from 'rxjs/operators';

import { CharMappingDict } from '@interfaces/char-mapping';
import { isComposing } from '@utils/key-event-utils';

export class CodeMatcher {
  private readonly pageSize = 10;
  private readonly pageUpKeys = Object.freeze(['PageUp', 'ArrowUp']);
  private readonly pageDownKeys = Object.freeze(['PageDown', 'ArrowDown']);

  private typingCode$$ = new BehaviorSubject<string>('');
  private matchedChars$$ = new BehaviorSubject<string[]>([]);
  private charSelections$$ = new BehaviorSubject<string[]>([]);
  private page$$ = new BehaviorSubject<number>(0);
  private totalPage$$ = new BehaviorSubject<number>(0);
  private char$$ = new Subject<string>();
  private cancel$$ = new Subject<void>();

  typingCode$ = this.typingCode$$.asObservable();
  matchedChars$ = this.matchedChars$$.asObservable();
  charSelections$ = this.charSelections$$.asObservable();
  page$ = this.page$$.pipe(distinctUntilChanged());
  totalPage$ = this.totalPage$$.pipe(distinctUntilChanged());
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

  constructor(private readonly charMappingDict: CharMappingDict) {}

  onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
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
    this.charSelections$$.next([]);
    this.page$$.next(0);
    this.totalPage$$.next(0);
  }

  private onTypingCode(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
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
    this.page$$.next(0);
    this.updateCharSelections();
  }

  private updateCharSelections(): void {
    const matchedChars = this.matchedChars$$.value;
    const charSelections = matchedChars.slice(
      this.page$$.value * this.pageSize,
      (this.page$$.value + 1) * this.pageSize,
    );
    this.charSelections$$.next(charSelections);
    this.totalPage$$.next(Math.ceil(matchedChars.length / this.pageSize));
  }

  private handleBackspace(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    const typingCode = this.typingCode$$.value;
    if (!typingCode.length) {
      return;
    }

    this.typingCode$$.next(typingCode.substring(0, typingCode.length - 1));
    this.updateMatchedChars();
    event.preventDefault();
  }

  private handleCancelInput(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    this.cancel$$.next();
    this.clear();
    event.preventDefault();
  }

  private handlePage(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (this.pageDownKeys.includes(event.key)) {
      this.page$$.next(Math.min(this.totalPage$$.value - 1, this.page$$.value + 1));
      this.updateCharSelections();
      event.preventDefault();
    } else if (this.pageUpKeys.includes(event.key)) {
      this.page$$.next(Math.max(0, this.page$$.value - 1));
      this.updateCharSelections();
      event.preventDefault();
    }
  }

  private recognizeInput(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
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

  private sendMatchedChar(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    const index = parseInt(event.key, 10) + this.page$$.value * this.pageSize;
    const char = this.matchedChars$$.value[index];
    if (char) {
      this.char$$.next(char);
      this.clear();
      event.preventDefault();
    }
  }
}
