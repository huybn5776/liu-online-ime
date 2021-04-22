import React, { useEffect, useRef, useState } from 'react';

import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import CaretFollowWrapper from '@components/CaretPositionWrapper/CaretFollowWrapper';
import CharChooser from '@components/CharChooser/CharChooser';
import { loadCharMappings } from '@services/char-mapping';
import { CodeMatcher } from '@services/code-matcher';
import { TypingCodePreview } from '@services/typing-code-preview';

import styles from './ImeTextArea.module.scss';

interface Props {
  value?: string;
  onValueChange?: (value: string) => void;
  inputMode?: InputMode;
  inputModeChange?: (inputMode: InputMode) => void;
}

export enum InputMode {
  english = 'english',
  chinese = 'chinese',
}

const ImeTextArea: React.FC<Props> = ({ value, onValueChange, inputMode: propsInputMode, inputModeChange }: Props) => {
  const [typingCode, setTypingCode] = useState('');
  const [charSelections, setCharSelections] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [inputMode, setInputMode] = useState<InputMode>(propsInputMode || InputMode.chinese);
  const [textArea, setTextArea] = useState<HTMLTextAreaElement | null>(null);

  const caretFollowWrapper = useRef<React.ElementRef<typeof CaretFollowWrapper>>(null);

  const codeMatcher$$ = useRef(new BehaviorSubject<CodeMatcher | null>(null));
  const codeMatcher$ = useRef<Observable<CodeMatcher>>(
    codeMatcher$$.current.pipe(filter((matcher) => matcher !== null)) as Observable<CodeMatcher>,
  );

  useEffect(() => {
    if (textArea) {
      textArea.value = value || '';
    }
  }, [textArea, value]);

  useEffect(() => {
    const subscription = loadCharMappings().subscribe((charMappingDict) => {
      codeMatcher$$.current.next(new CodeMatcher(charMappingDict));
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!textArea) {
      return () => {};
    }
    textArea.focus();

    const textAreaUpdated$$ = new Subject<void>();

    codeMatcher$.current.subscribe((codeMatcher) => {
      const typingCodePreview = new TypingCodePreview(textArea, codeMatcher);

      codeMatcher.typingCode$.pipe(takeUntil(textAreaUpdated$$)).subscribe((code) => setTypingCode(code));
      codeMatcher.charSelections$.pipe(takeUntil(textAreaUpdated$$)).subscribe(setCharSelections);
      codeMatcher.page$.pipe(takeUntil(textAreaUpdated$$)).subscribe(setPage);
      codeMatcher.totalPage$.pipe(takeUntil(textAreaUpdated$$)).subscribe(setTotalPages);
      codeMatcher.startTypingCode$.subscribe(() => {
        typingCodePreview.deleteSelectedText();
        caretFollowWrapper.current?.updatePosition();
        typingCodePreview.startTyping();
        typingCodePreview.value$.pipe(takeUntil(codeMatcher.stopTypingCode$)).subscribe(onValueChange);

        textAreaUpdated$$.subscribe(() => {
          codeMatcher.clear();
          setTypingCode('');
          setCharSelections([]);
          typingCodePreview.dispose();
        });
      });
    });

    return () => {
      textAreaUpdated$$.next();
      textAreaUpdated$$.complete();
    };
  }, [textArea, onValueChange]);

  useEffect(() => setInputMode(propsInputMode || InputMode.chinese), [propsInputMode]);

  return (
    <div className={styles.ImeTextArea}>
      <textarea className={styles.textarea} ref={setTextArea} onKeyDown={onKeyDown} />
      <CaretFollowWrapper passive ref={caretFollowWrapper} textArea={textArea}>
        <p className={styles.typingCode}>{typingCode}</p>
        <CharChooser charSelections={charSelections} page={page} totalPages={totalPages} />
      </CaretFollowWrapper>
    </div>
  );

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === 'Shift') {
      handleShiftKey();
    }
    if (inputMode === InputMode.english) {
      return;
    }
    if (!codeMatcher$$.current?.value) {
      handleCharMappingNotReady(event);
      return;
    }

    codeMatcher$$.current?.value?.onKeyDown?.(event);
    if (event.isDefaultPrevented()) {
      return;
    }

    handleCopy(event);
  }

  function handleShiftKey(): void {
    if (!textArea) {
      return;
    }
    fromEvent<KeyboardEvent>(textArea, 'keyup')
      .pipe(
        take(1),
        takeUntil(fromEvent(textArea, 'keydown')),
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
        codeMatcher$$.current?.value?.clear();
      });
  }

  function handleCharMappingNotReady(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    const codeChars = "abcdefghijklmnopqrstuvwxyz,.'[]";
    if (!codeChars.includes(event.key)) {
      return;
    }
    setCharSelections(['字碼表載入中...']);
    caretFollowWrapper.current?.updatePosition();
  }

  function handleCopy(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (!((event.metaKey || event.ctrlKey || event.altKey) && event.key === 'Enter' && textArea)) {
      return;
    }

    textArea.select();
    document.execCommand('copy');
    event.preventDefault();

    if (event.shiftKey) {
      textArea.value = '';
    }
  }
};

export default ImeTextArea;
