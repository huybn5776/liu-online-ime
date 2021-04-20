import React, { useEffect, useRef, useState } from 'react';

import * as R from 'ramda';

import { CharMapping } from '@interfaces/char-mapping';
import {
  getUserDictFromLocalStorage,
  saveUserDictToLocalStorage,
} from '@services/char-mapping/user-dict-char-mapping-service';
import { getCounter } from '@utils/counter-utils';

import styles from './UserDictSettings.module.scss';

interface ColDefine<T> {
  field: keyof T;
  maxLength?: number;
}

const UserDictSettings: React.FC = () => {
  const [nextId] = useState(() => getCounter(0).next);

  const [userDict, setUserDict] = useState<CharMapping[]>(() => {
    return R.pipe(
      getUserDictFromLocalStorage,
      R.defaultTo([]),
      R.append({ code: '', char: '' } as CharMapping),
      R.map(({ char, code }) => ({ id: nextId(), char, code })),
    )();
  });
  const [focusIndex, setFocusIndex] = useState(-1);

  const inputRefList = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    saveUserDictToLocalStorage(userDict);
  }, [userDict]);

  return (
    <div className={styles.UserDictSettings}>
      <p className={styles.userDictGridHeader} />
      <p className={styles.userDictGridHeader}>拆碼 (最多5碼)</p>
      <p className={styles.userDictGridHeader}>對應字詞</p>
      {renderRows(userDict, [{ field: 'code', maxLength: 5 }, { field: 'char' }])}
    </div>
  );

  function renderRows(charMappings: CharMapping[], colDefines: ColDefine<CharMapping>[]): JSX.Element[] {
    return charMappings.map((charMapping, rowIndex) => (
      <React.Fragment key={charMapping.id}>
        {renderDeleteButton(charMapping)}
        {colDefines.map((colDefine, colIndex) => {
          const cellIndex = getIndexOfCell(rowIndex, colIndex);

          return (
            <input
              className={styles.userDictInput}
              type="text"
              key={charMapping.id + colDefine.field}
              value={charMapping[colDefine.field]}
              maxLength={colDefine.maxLength}
              tabIndex={cellIndex + 1}
              onChange={(event) => onUserDictRowChange(rowIndex, { [colDefine.field]: event.target.value })}
              onKeyDown={(event) => onUserDictInputKeyDown(event, charMapping, rowIndex)}
              onFocus={() => setFocusIndex(cellIndex)}
              ref={(input) => {
                inputRefList.current[cellIndex] = input;
                if (input && focusIndex === cellIndex) {
                  input.focus();
                }
              }}
            />
          );
        })}
      </React.Fragment>
    ));
  }

  function renderDeleteButton(charMapping: CharMapping): JSX.Element {
    return (
      <div className={styles.userDictDeleteButtonContainer}>
        {charMapping.char || charMapping.code ? (
          <button className={styles.userDictDeleteButton} type="button" onClick={() => deleteCharMapping(charMapping)}>
            <i className="trash alternate outline icon" />
          </button>
        ) : null}
      </div>
    );
  }

  function deleteCharMapping(charMapping: CharMapping): void {
    setUserDict(R.reject(R.equals(charMapping), userDict));
  }

  function onUserDictRowChange(index: number, charMappingChanges: Partial<CharMapping>): void {
    const newUserDict = [...userDict];
    const charMapping = { ...userDict[index], ...charMappingChanges } as CharMapping;
    newUserDict[index] = charMapping;
    setUserDict(newUserDict);

    const isFocusOnLastRow = focusIndex >= getIndexOfCell(userDict.length - 1, 0);
    if ((charMapping.char || charMapping.code) && isFocusOnLastRow) {
      setUserDict([...newUserDict, { id: nextId(), code: '', char: '' }]);
    }
  }

  function onUserDictInputKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    charMapping: CharMapping,
    index: number,
  ): void {
    if (event.key === 'Enter') {
      handleEnterKey(event, charMapping, index);
    } else if (event.key === 'Backspace') {
      handleBackspaceKey(event, charMapping, index);
    }
  }

  function handleEnterKey(event: React.KeyboardEvent<HTMLInputElement>, charMapping: CharMapping, index: number): void {
    setFocusIndex(focusIndex + 1);

    const isFocusOnLastCell = focusIndex === getIndexOfCell(userDict.length - 1, 1);
    if (isFocusOnLastCell && userDict[index].code && userDict[index].char) {
      const newUserDict = [...userDict, { id: nextId(), code: '', char: '' }];
      setUserDict(newUserDict);
    }
    event.preventDefault();
  }

  function handleBackspaceKey(
    event: React.KeyboardEvent<HTMLInputElement>,
    charMapping: CharMapping,
    index: number,
  ): void {
    if (!event.metaKey && !event.ctrlKey) {
      return;
    }

    const newUserDict = [...userDict.slice(0, index), ...userDict.slice(index + 1)];
    setUserDict(newUserDict);

    const nextFocusCellIndex = getIndexOfCell(index - 1, 0);
    inputRefList.current?.[nextFocusCellIndex]?.focus();
    event.preventDefault();
  }

  function getIndexOfCell(rowNumber: number, colNumber: number): number {
    const colCount = 2;
    return rowNumber * colCount + colNumber;
  }
};

export default UserDictSettings;
