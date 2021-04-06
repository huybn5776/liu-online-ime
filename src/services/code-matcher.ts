import React from 'react';

import { BehaviorSubject, Subject } from 'rxjs';

import { CharMappingDict } from '../interfaces/char-mapping';
import { isComposing } from '../utils/key-event-utils';

export class CodeMatcher {
  private typingCode$$ = new BehaviorSubject<string>('');
  private matchedChars$$ = new BehaviorSubject<string[]>([]);
  private char$$ = new Subject<string>();

  typingCode$ = this.typingCode$$.asObservable();
  matchedChars$ = this.matchedChars$$.asObservable();
  char$ = this.char$$.asObservable();

  constructor(private readonly charMappingDict: CharMappingDict) {}

  onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.metaKey || event.shiftKey || isComposing(event)) {
      return;
    }

    const inputKey = event.key;
    if (inputKey.match(/^[a-z]$/)) {
      this.onTypingCode(event);
    } else if (inputKey === 'Backspace') {
      this.handleBackspace(event);
    } else if (inputKey === ' ') {
      this.recognizeInput(event);
    } else if (inputKey.match(/\d/)) {
      this.sendMatchedChar(event);
    }
  }

  clear(): void {
    this.typingCode$$.next('');
    this.matchedChars$$.next([]);
  }

  private onTypingCode(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    this.typingCode$$.next(this.typingCode$$.value + event.key);
    this.updateMatchedChars();
    event.preventDefault();
  }

  private updateMatchedChars(): void {
    const typingCode = this.typingCode$$.value;
    const matchedChars = this.charMappingDict[typingCode] || [];
    this.matchedChars$$.next(matchedChars);
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

  private recognizeInput(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    const firstMatch = this.matchedChars$$.value[0];
    if (firstMatch) {
      this.char$$.next(firstMatch);
    }
    this.clear();
    event.preventDefault();
  }

  private sendMatchedChar(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    const index = parseInt(event.key, 10);
    const char = this.matchedChars$$.value[index];
    if (char) {
      this.char$$.next(char);
      this.clear();
      event.preventDefault();
    }
  }
}
