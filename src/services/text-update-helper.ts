import { merge, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { CodeMatcher } from './code-matcher';

export class TextUpdateHelper {
  private value = '';
  private selectionStart = 0;
  private dispose$$ = new Subject<void>();
  private value$$ = new Subject<string>();

  value$ = this.value$$.asObservable();

  constructor(private readonly textArea: HTMLTextAreaElement, private readonly codeMatcher: CodeMatcher) {}

  deleteSelectedText(): void {
    const { value, selectionStart, selectionEnd } = this.textArea;
    this.textArea.value = value.slice(0, selectionStart) + value.slice(selectionEnd);
    this.textArea.setSelectionRange(selectionStart, selectionStart);
  }

  startTyping(): void {
    this.value = this.textArea.value;
    this.selectionStart = this.textArea.selectionStart;
    this.handleTextInsert();
    this.handleTextRestore();
  }

  dispose(): void {
    this.dispose$$.next();
    this.dispose$$.complete();
  }

  private handleTextInsert(): void {
    this.codeMatcher.typingCode$
      .pipe(
        takeUntil(this.codeMatcher.char$),
        takeUntil(this.dispose$$),
        takeUntil(this.codeMatcher.stopTypingCode$),
        map((code) => code.toUpperCase()),
      )
      .subscribe((texToInsert) => this.insertTextToTextArea(texToInsert));
    this.codeMatcher.char$
      .pipe(take(1))
      .pipe(takeUntil(merge(this.dispose$$, this.codeMatcher.stopTypingCode$)), take(1))
      .subscribe((texToInsert) => {
        this.insertTextToTextArea(texToInsert);
        this.value$$.next(this.textArea.value);
      });
  }

  private insertTextToTextArea(texToInsert: string): void {
    this.textArea.value =
      this.value.slice(0, this.selectionStart) + texToInsert + this.value.slice(this.selectionStart);
    const cursorPosition = this.selectionStart + texToInsert.length;
    this.textArea.setSelectionRange(cursorPosition, cursorPosition);
  }

  private handleTextRestore(): void {
    const restoreValue: () => void = () => {
      this.textArea.value = this.value;
      this.textArea.setSelectionRange(this.selectionStart, this.selectionStart);
    };
    this.codeMatcher.cancel$
      .pipe(takeUntil(this.dispose$$), takeUntil(this.codeMatcher.stopTypingCode$), take(1))
      .subscribe(restoreValue);
    this.codeMatcher.stopTypingCode$
      .pipe(takeUntil(this.dispose$$), takeUntil(this.codeMatcher.char$))
      .subscribe(restoreValue);
  }
}
