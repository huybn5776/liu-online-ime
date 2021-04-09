import React, { forwardRef, memo } from 'react';

import './CharChooser.scss';

interface Props {
  matchedChars: string[];
}

const CharChooser: React.ForwardRefRenderFunction<HTMLDivElement, Props> = ({ matchedChars }: Props, ref) => {
  return (
    <div className="CharChooser" ref={ref} hidden={!matchedChars.length}>
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
  );
};

export default memo(forwardRef(CharChooser));
