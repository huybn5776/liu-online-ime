import React, { useState } from 'react';

import ImeTextArea, { InputMode } from '@components/ImeTextArea/ImeTextArea';
import ToolbarClear from '@components/toolbar-buttons/ToolbarClear/ToolbarClear';
import ToolbarCopyAll from '@components/toolbar-buttons/ToolbarCopyAll/ToolbarCopyAll';
import ToolbarCopyAndClear from '@components/toolbar-buttons/ToolbarCopyAndClear/ToolbarCopyAndClear';
import ToolbarExpandToggle from '@components/toolbar-buttons/ToolbarExpandToggle/ToolbarExpandToggle';
import ToolbarGoToSetting from '@components/toolbar-buttons/ToolbarGoToSetting/ToolbarGoToSetting';
import ToolbarSwitchInputMode from '@components/toolbar-buttons/ToolbarSwitchInputMode/ToolbarSwitchInputMode';
import { SettingKey } from '@services/setting';
import { getSetting, setSetting } from '@services/setting/setting-service';

import styles from './InputPage.module.scss';

const InputPage: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.chinese);
  const [inputModeLabel] = useState<Record<InputMode, string>>({
    [InputMode.chinese]: '嘸',
    [InputMode.english]: 'Ａ',
  });
  const [value, setValue] = useState('');
  const [toolbarExpanded, setToolbarExpanded] = useState<boolean>(getSetting(SettingKey.toolbarExpanded));

  return (
    <div className={styles.InputPage}>
      <ImeTextArea value={value} inputMode={inputMode} onValueChange={setValue} inputModeChange={setInputMode}/>

      <div className={styles.bottomToolbar}>
        <ToolbarSwitchInputMode
          expand={toolbarExpanded}
          modeLabel={inputModeLabel[inputMode]}
          onClick={toggleInputMode}
        />
        <ToolbarCopyAll expand={toolbarExpanded} onClick={copyAll}/>
        <ToolbarCopyAndClear expand={toolbarExpanded} onClick={copyAndClear}/>
        <ToolbarClear expand={toolbarExpanded} onClick={clear}/>
        <ToolbarExpandToggle expand={toolbarExpanded} onExpandChange={onExpandToggleClick}/>
        <ToolbarGoToSetting expand={toolbarExpanded}/>
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

  function onExpandToggleClick(): void {
    const expand = !toolbarExpanded;
    setToolbarExpanded(expand);
    setSetting(SettingKey.toolbarExpanded, expand);
  }
};

export default InputPage;
