import React, { useEffect, useRef, useState } from 'react';

import { fromEvent, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { loadCharMappings } from '../../services/char-mapping-service';
import { CodeMatcher } from '../../services/code-matcher';
import './ImeTextArea.scss';

interface Props {
  inputMode?: InputMode;
  inputModeChange?: (inputMode: InputMode) => void;
}

export enum InputMode {
  english = 'english',
  chinese = 'chinese',
}

const ImeTextArea: React.FC<Props> = ({ inputMode: propsInputMode, inputModeChange }: Props) => {
  const [codeMatcher, setCodeMatcher] = useState<CodeMatcher>();
  const [typingCode, setTypingCode] = useState('');
  const [matchedChars, setMatchedChars] = useState<string[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>(propsInputMode || InputMode.chinese);

  const textArea = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const componentDestroyed$$ = new Subject();
    loadCharMappings()
      .pipe(takeUntil(componentDestroyed$$))
      .subscribe((charMappingDict) => {
        const matcher = new CodeMatcher(charMappingDict);
        setCodeMatcher(matcher);

        matcher.typingCode$.pipe(takeUntil(componentDestroyed$$)).subscribe(setTypingCode);
        matcher.matchedChars$.pipe(takeUntil(componentDestroyed$$)).subscribe(setMatchedChars);
        matcher.char$.pipe(takeUntil(componentDestroyed$$)).subscribe(onCharSend);
      });

    return () => {
      componentDestroyed$$.next();
      componentDestroyed$$.complete();
    };
  }, []);
  useEffect(() => setInputMode(propsInputMode || InputMode.chinese), [propsInputMode]);

  return (
    <div>
      <textarea className="ime-textarea" ref={textArea} onKeyDown={onKeyDown} />
      <p className="typing-code">{typingCode}</p>
      {matchedChars.length ? (
        <div className="char-chooser">
          <ul className="matched-char-list">
            {matchedChars.map((matchedChar) => (
              <li className="matched-char-item" key={matchedChar}>
                {matchedChar}
              </li>
            ))}
          </ul>

          <div className="state-line">
            <span className="number-key-label">數字鍵</span>
            <span className="pagination-label">(1/1)</span>
          </div>
        </div>
      ) : null}
    </div>
  );

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === 'Shift') {
      handleShiftKey();
    }
    if (inputMode === InputMode.english) {
      return;
    }

    codeMatcher?.onKeyDown?.(event);
    if (event.isDefaultPrevented()) {
      return;
    }

    handleCopy(event);
  }

  function handleShiftKey(): void {
    if (!textArea.current) {
      return;
    }
    fromEvent<KeyboardEvent>(textArea.current, 'keyup')
      .pipe(
        take(1),
        takeUntil(fromEvent(textArea.current, 'keydown')),
        filter((event) => event.key === 'Shift'),
      )
      .subscribe(() => {
        const nextInputModeMap: Record<InputMode, InputMode> = {
          [InputMode.chinese]: InputMode.english,
          [InputMode.english]: InputMode.chinese,
        };
        const nextInputMode = nextInputModeMap[inputMode];
        setInputMode(nextInputMode);
        inputModeChange?.(nextInputMode);
        codeMatcher?.clear();
      });
  }

  function handleCopy(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (!((event.metaKey || event.ctrlKey || event.altKey) && event.key === 'Enter' && textArea.current)) {
      return;
    }

    textArea.current.select();
    document.execCommand('copy');
    event.preventDefault();

    if (event.shiftKey) {
      textArea.current.value = '';
    }
  }

  function onCharSend(char: string): void {
    const textAreaElement = textArea.current;
    if (!textAreaElement) {
      return;
    }

    const cursorPosition = textAreaElement.selectionStart + char.length;
    const { value, selectionStart, selectionEnd } = textAreaElement;
    textAreaElement.value = value.slice(0, selectionStart) + char + value.slice(selectionEnd);
    textAreaElement.setSelectionRange(cursorPosition, cursorPosition);
  }
};

export default ImeTextArea;
