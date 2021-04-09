import React, { useEffect, useRef, useState } from 'react';

import { fromEvent, Subject } from 'rxjs';
import { bufferCount, filter, take, takeUntil } from 'rxjs/operators';

import { loadCharMappings } from '../../services/char-mapping-service';
import { CodeMatcher } from '../../services/code-matcher';
import CaretPosition from '../CaretPosition/CaretPosition';
import CharChooser from '../CharChooser/CharChooser';
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

  const caretPositionComponent = useRef<React.ElementRef<typeof CaretPosition>>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const charChooser = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const componentDestroyed$$ = new Subject();
    const typingCode$$ = new Subject<string>();

    loadCharMappings()
      .pipe(takeUntil(componentDestroyed$$))
      .subscribe((charMappingDict) => {
        const matcher = new CodeMatcher(charMappingDict);
        setCodeMatcher(matcher);

        matcher.typingCode$.pipe(takeUntil(componentDestroyed$$)).subscribe((code) => {
          setTypingCode(code);
          typingCode$$.next(code);
        });
        matcher.matchedChars$.pipe(takeUntil(componentDestroyed$$)).subscribe(setMatchedChars);
        matcher.char$.pipe(takeUntil(componentDestroyed$$)).subscribe(onCharSend);
      });

    const startTypingCode$ = typingCode$$.pipe(
      bufferCount(2, 1),
      filter(([lastCode, currentCode]) => !lastCode && !!currentCode),
    );
    startTypingCode$.subscribe(() => {
      const charChooserElement = charChooser.current;
      const position = caretPositionComponent.current?.getPosition();
      if (!charChooserElement || !position) {
        return;
      }

      charChooserElement.style.left = `${position.x}px`;
      charChooserElement.style.top = `${position.y}px`;
    });

    return () => {
      componentDestroyed$$.next();
      componentDestroyed$$.complete();
    };
  }, []);
  useEffect(() => setInputMode(propsInputMode || InputMode.chinese), [propsInputMode]);
  useEffect(() => textArea.current?.focus(), [textArea]);

  return (
    <div>
      <textarea className="ime-textarea" ref={textArea} onKeyDown={onKeyDown}/>
      <CaretPosition passive ref={caretPositionComponent} textArea={textArea.current} />

      <p className="typing-code">{typingCode}</p>
      <CharChooser ref={charChooser} matchedChars={matchedChars} />
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
