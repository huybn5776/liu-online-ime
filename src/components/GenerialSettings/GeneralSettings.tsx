import React, { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import { getUserDictAsBase64String } from '@services/char-mapping/user-dict-char-mapping-service';
import { SettingKey } from '@services/setting';
import { getAllSettingsAsBase64String, getSetting, setSetting } from '@services/setting/setting-service';
import { isNotNilOrEmpty } from '@utils/object-utils';

import styles from './GeneralSettings.module.scss';

const GeneralSettings: React.FC = () => {
  const [settingUrl, setSettingUrl] = useState('');
  const settingUrlInput = useRef<HTMLInputElement | null>(null);
  const [quickCopyMode, setQuickCopyMode] = useState<boolean>(getSetting(SettingKey.quickCopyMode));

  useEffect(() => {
    setSetting(SettingKey.quickCopyMode, quickCopyMode);
  }, [quickCopyMode]);

  function settingsToUrl(): string {
    const currentUrl = new URL(window.location.href);
    const url = new URL(currentUrl.origin);

    const searchParams = {
      cin: currentUrl.searchParams.get('cin'),
      userDict: getUserDictAsBase64String(),
      settings: getAllSettingsAsBase64String(),
    };
    Object.entries(searchParams)
      .filter(([, value]) => isNotNilOrEmpty(value))
      .forEach(([name, value]) => {
        url.searchParams.append(name, value || '');
      });

    return url.href;
  }

  function copySettingUrl(): void {
    settingUrlInput?.current?.select?.();
    document.execCommand('copy');
  }

  return (
    <div className={styles.GeneralSetting}>
      <div className={clsx('ui', 'checkbox', { checked: quickCopyMode })}>
        <input
          id="checkbox-quick-copy"
          type="checkbox"
          className="hidden"
          checked={quickCopyMode}
          onChange={(event) => setQuickCopyMode(event.target.checked)}
        />
        <label htmlFor="checkbox-quick-copy" className={styles.settingLabel}>
          快速複製
          <p className={styles.settingDescription}>Enter 鍵立即複製並清除，shift+enter 以換行</p>
        </label>
      </div>

      <button
        className={clsx('ui', 'button', styles.exportSettingButton)}
        type="button"
        onClick={() => setSettingUrl(settingsToUrl())}
      >
        匯出設定為 url
      </button>
      {settingUrl ? (
        <label className={styles.settingUrlLabel} htmlFor="exported-setting-url">
          將此 url 於其它裝置上開啟，即可套用目前的設定以及加字加詞。你可以把它存在
          <a href="https://reurl.cc/main/tw" target="_blank" rel="noreferrer noopener">
            短網址
          </a>
          的服務裡
          <br />
          <input
            id="exported-setting-url"
            className={clsx('ui', 'input', styles.settingUrlInput)}
            ref={(input) => {
              settingUrlInput.current = input;
              input?.select();
              input?.focus();
            }}
            readOnly
            type="url"
            value={settingUrl}
          />
          <button className="mini ui button" type="button" onClick={copySettingUrl}>
            複製
          </button>
        </label>
      ) : null}
    </div>
  );
};

export default GeneralSettings;
