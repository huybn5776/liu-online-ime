import React, { useState } from 'react';

import ImeTextArea, { InputMode } from '../ImeTextArea/ImeTextArea';
import ToolbarClear from '../toolbar-buttons/ToolbarClear/ToolbarClear';
import ToolbarCopyAll from '../toolbar-buttons/ToolbarCopyAll/ToolbarCopyAll';
import ToolbarCopyAndClear from '../toolbar-buttons/ToolbarCopyAndClear/ToolbarCopyAndClear';
import ToolbarExpandToggle from '../toolbar-buttons/ToolbarExpandToggle/ToolbarExpandToggle';
import ToolbarGoToSetting from '../toolbar-buttons/ToolbarGoToSetting/ToolbarGoToSetting';
import ToolbarSwitchInputMode from '../toolbar-buttons/ToolbarSwitchInputMode/ToolbarSwitchInputMode';
import './InputPage.scss';

const InputPage: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.chinese);
  const [inputModeLabel] = useState<Record<InputMode, string>>({
    [InputMode.chinese]: '嘸',
    [InputMode.english]: 'Ａ',
  });
  const [value, setValue] = useState('');
  const [toolbarExpanded, setToolbarExpanded] = useState(true);

  return (
    <div className="InputPage">
      <div className="ime-input-container">
        <ImeTextArea value={value} inputMode={inputMode} onValueChange={setValue} inputModeChange={setInputMode}/>
      </div>

      <div className={`bottom-toolbar${toolbarExpanded ? ' expand' : ''}`}>
        <ToolbarSwitchInputMode
          expand={toolbarExpanded}
          modeLabel={inputModeLabel[inputMode]}
          onClick={toggleInputMode}
        />
        <ToolbarCopyAll expand={toolbarExpanded} onClick={copyAll}/>
        <ToolbarCopyAndClear expand={toolbarExpanded} onClick={copyAndClear}/>
        <ToolbarClear expand={toolbarExpanded} onClick={clear}/>
        <ToolbarExpandToggle expand={toolbarExpanded} onExpandChange={setToolbarExpanded}/>
        <ToolbarGoToSetting className="setting-button" expand={toolbarExpanded}/>
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

  function copyAll(): void {
    navigator.clipboard.writeText(value);
  }

  function clear(): void {
    setValue('');
  }

  function copyAndClear(): void {
    copyAll();
    clear();
  }
};

export default InputPage;
