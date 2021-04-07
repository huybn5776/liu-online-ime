import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import ImeTextArea, { InputMode } from '../ImeTextArea/ImeTextArea';
import './InputPage.scss';

const InputPage: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.chinese);
  const [inputModeLabel] = useState<Record<InputMode, string>>({
    [InputMode.chinese]: '嘸',
    [InputMode.english]: 'Ａ',
  });

  return (
    <div className="InputPage">
      <div className="ime-input-container">
        <ImeTextArea inputMode={inputMode} inputModeChange={setInputMode} />
        <Link to="/settings" className="icon-button setting-page-link">
          <i className="cog icon" />
        </Link>
        <button className="input-mode-button" type="button" onClick={toggleInputMode}>
          {inputModeLabel[inputMode]}
        </button>
      </div>
    </div>
  );

  function toggleInputMode(): void {
    const nextInputModeMap: Record<InputMode, InputMode> = {
      [InputMode.chinese]: InputMode.english,
      [InputMode.english]: InputMode.chinese,
    };
    setInputMode(nextInputModeMap[inputMode]);
  }
};

export default InputPage;
