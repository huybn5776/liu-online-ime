import React, { forwardRef, memo } from 'react';

import styles from './CharChooser.module.scss';

interface Props {
  charSelections: string[];
  page: number;
  totalPages: number;
}

const CharChooser: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { charSelections, page, totalPages }: Props,
  ref,
) => {
  return (
    <div className={styles.CharChooser} ref={ref} hidden={!charSelections.length}>
      <ul className={styles.matchedCharList}>
        {charSelections.map((char) => (
          <li className={styles.matchedCharItem} key={char}>
            {char}
          </li>
        ))}
      </ul>

      <div className={styles.stateLine}>
        <span className={styles.numberKeyLabel}>數字鍵</span>
        <span className={styles.paginationLabel}>{`(${page + 1}/${totalPages})`}</span>
      </div>
    </div>
  );
};

export default memo(forwardRef(CharChooser));
