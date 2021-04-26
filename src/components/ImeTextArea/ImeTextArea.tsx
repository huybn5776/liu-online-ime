import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import CaretFollowWrapper from '@components/CaretPositionWrapper/CaretFollowWrapper';
import CharChooser from '@components/CharChooser/CharChooser';
import { loadCharMappings } from '@services/char-mapping';
import { CodeMatcher, emptyMatchResult, MatchResult } from '@services/code-matcher';
import { TextUpdateHelper } from '@services/text-update-helper';

import { useStateBinding } from '../../hooks/use-state-binding';
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

const nextInputModeMap: Record<InputMode, InputMode> = {
  [InputMode.chinese]: InputMode.english,
  [InputMode.english]: InputMode.chinese,
};

function hasModifiersKey(event: KeyboardEvent): boolean {
  return event.metaKey || event.altKey || event.ctrlKey;
}

const ImeTextArea: React.FC<Props> = ({
  value: valueFromProp,
  onValueChange,
  inputMode: inputModeFromProp,
  inputModeChange,
}: Props) => {
  const [value, setValue] = useStateBinding<string>('', valueFromProp, onValueChange);
  const [inputMode, setInputMode] = useStateBinding<InputMode>(
    inputModeFromProp || InputMode.chinese,
    inputModeFromProp,
    inputModeChange,
  );

  const [matchResult, setMatchResult] = useState<MatchResult>(emptyMatchResult);
  const [textArea, setTextArea] = useState<HTMLTextAreaElement | null>(null);
  const [codeMatcher, setCodeMatcher] = useState<CodeMatcher | null>(null);

  const caretFollowWrapper = useRef<React.ElementRef<typeof CaretFollowWrapper>>(null);

  const keyDown$$ = useMemo(() => new Subject<KeyboardEvent>(), []);
  const keyUp$$ = useMemo(() => new Subject<KeyboardEvent>(), []);
  const onKeyDown = useCallback((event: React.KeyboardEvent) => keyDown$$.next(event.nativeEvent), [keyDown$$]);
  const onKeyUp = useCallback((event: React.KeyboardEvent) => keyUp$$.next(event.nativeEvent), [keyUp$$]);

  useEffect(() => {
    if (textArea) {
      textArea.value = value || '';
    }
  }, [textArea, value]);

  useEffect(() => {
    const subscription = loadCharMappings().subscribe((charMappingDict) =>
      setCodeMatcher(new CodeMatcher(charMappingDict)),
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!textArea || !codeMatcher) {
      return () => {};
    }
    textArea.focus();

    const textAreaUpdated$$ = new Subject<void>();

    const textUpdateHelper = new TextUpdateHelper(textArea, codeMatcher);
    codeMatcher.matchResult$.pipe(takeUntil(textAreaUpdated$$)).subscribe(setMatchResult);
    codeMatcher.startTypingCode$.subscribe(() => {
      textUpdateHelper.deleteSelectedText();
      caretFollowWrapper.current?.updatePosition();
      textUpdateHelper.startTyping();
      textUpdateHelper.value$.pipe(takeUntil(codeMatcher.stopTypingCode$)).subscribe(setValue);

      textAreaUpdated$$.subscribe(() => {
        codeMatcher.clear();
        textUpdateHelper.dispose();
      });
    });

    return () => {
      textAreaUpdated$$.next();
      textAreaUpdated$$.complete();
    };
  }, [textArea, codeMatcher, onValueChange, setValue, setMatchResult]);

  const handleCharMappingNotReady = useCallback(
    (event: KeyboardEvent) => {
      const codeChars = "abcdefghijklmnopqrstuvwxyz,.'[]";
      if (codeMatcher || !codeChars.includes(event.key)) {
        return false;
      }
      setMatchResult({ ...emptyMatchResult, charSelections: ['字碼表載入中...'] });
      caretFollowWrapper.current?.updatePosition();
      return true;
    },
    [codeMatcher],
  );

  const handleCodeMatch = useCallback(
    (event: KeyboardEvent) => {
      if (inputMode !== InputMode.chinese || hasModifiersKey(event)) {
        return false;
      }
      codeMatcher?.onKeyDown?.(event);
      return event.defaultPrevented;
    },
    [inputMode, codeMatcher],
  );

  const handleShiftKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Shift' || event.altKey || event.ctrlKey || event.metaKey) {
        return false;
      }

      keyUp$$
        .pipe(
          take(1),
          takeUntil(keyDown$$),
          filter((keyEvent) => keyEvent.key === 'Shift'),
        )
        .subscribe(() => {
          setInputMode((currentInputMode) => nextInputModeMap[currentInputMode]);
          codeMatcher?.clear();
        });

      return false;
    },
    [keyDown$$, keyUp$$, setInputMode, codeMatcher],
  );

  const handleCopy = useCallback(
    (event: KeyboardEvent) => {
      if (!((event.metaKey || event.ctrlKey || event.altKey) && event.key === 'Enter')) {
        return false;
      }
      codeMatcher?.clear();
      navigator.clipboard.writeText(value);
      event.preventDefault();
      if (event.shiftKey) {
        setValue('');
      }
      return true;
    },
    [codeMatcher, setValue, value],
  );

  useEffect(() => {
    const subscription = keyDown$$.subscribe((event) => {
      const eventHandled =
        handleCharMappingNotReady(event) || handleCodeMatch(event) || handleShiftKey(event) || handleCopy(event);
      if (eventHandled) {
        event.preventDefault();
      }
    });
    return () => subscription.unsubscribe();
  }, [keyDown$$, handleCharMappingNotReady, handleCodeMatch, handleCopy, handleShiftKey]);

  return (
    <div className={styles.ImeTextArea}>
      <textarea
        className={styles.textarea}
        ref={setTextArea}
        onChange={(event) => onValueChange?.((event.target as HTMLTextAreaElement).value)}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
      <CaretFollowWrapper passive ref={caretFollowWrapper} textArea={textArea}>
        <p className={styles.typingCode}>{matchResult.typingCode}</p>
        <CharChooser
          charSelections={matchResult.charSelections}
          page={matchResult.page}
          totalPages={matchResult.totalPages}
        />
      </CaretFollowWrapper>
    </div>
  );
};

export default ImeTextArea;
