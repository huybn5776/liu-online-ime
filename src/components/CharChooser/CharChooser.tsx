import React, { memo } from 'react';

import './CharChooser.scss';

interface Props {
  matchedChars: string[];
}

const CharChooser: React.FC<Props> = ({ matchedChars }: Props) => {
  return (
    <div className="CharChooser" >
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

export default memo(CharChooser);
