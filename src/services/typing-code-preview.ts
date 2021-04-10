import { merge, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { CodeMatcher } from './code-matcher';

export class TypingCodePreview {
  private value = '';
  private selectionStart = 0;
  private dispose$$ = new Subject<void>();

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
    merge(
      this.codeMatcher.typingCode$.pipe(
        takeUntil(this.codeMatcher.char$),
        map((code) => code.toUpperCase()),
      ),
      this.codeMatcher.char$?.pipe(take(1)),
    )
      .pipe(takeUntil(this.dispose$$), takeUntil(this.codeMatcher.stopTypingCode$))
      .subscribe((texToInsert) => {
        this.textArea.value =
          this.value.slice(0, this.selectionStart) + texToInsert + this.value.slice(this.selectionStart);
        const cursorPosition = this.selectionStart + texToInsert.length;
        this.textArea.setSelectionRange(cursorPosition, cursorPosition);
      });
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
