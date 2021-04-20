import React, { forwardRef, memo } from 'react';

import styles from './CharChooser.module.scss';

interface Props {
  matchedChars: string[];
}

const CharChooser: React.ForwardRefRenderFunction<HTMLDivElement, Props> = ({ matchedChars }: Props, ref) => {
  return (
    <div className={styles.CharChooser} ref={ref} hidden={!matchedChars.length}>
      <ul className={styles.matchedCharList}>
        {matchedChars.map((matchedChar) => (
          <li className={styles.matchedCharItem} key={matchedChar}>
            {matchedChar}
          </li>
        ))}
      </ul>

      <div className={styles.stateLine}>
        <span className={styles.numberKeyLabel}>數字鍵</span>
        <span className={styles.paginationLabel}>(1/1)</span>
      </div>
    </div>
  );
};

export default memo(forwardRef(CharChooser));
