import React, { useRef, useState } from 'react';

import { getUserDictAsBase64String } from '../../services/char-mapping/user-dict-char-mapping-service';
import './GeneralSettings.scss';

const GeneralSettings: React.FC = () => {
  const [settingUrl, setSettingUrl] = useState('');
  const settingUrlInput = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <button className="ui button" type="button" onClick={() => setSettingUrl(settingsToUrl)}>
        匯出設定為 url
      </button>
      <br />
      {settingUrl ? (
        <label className="setting-url-label" htmlFor="exported-setting-url">
          將此 url 於其它裝置上開啟，即可套用目前的設定以及加字加詞。你可以把它存在
          <a href="https://reurl.cc/main/tw" target="_blank" rel="noreferrer noopener">
            短網址
          </a>
          的服務裡
          <br />
          <input
            id="exported-setting-url"
            className="ui input setting-url-input"
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

  function settingsToUrl(): string {
    const siteUrl = window.location.origin;
    const url = new URL(siteUrl);

    const userDict = getUserDictAsBase64String();
    if (userDict) {
      url.searchParams.append('userDict', userDict);
    }

    return url.href;
  }

  function copySettingUrl(): void {
    settingUrlInput?.current?.select?.();
    document.execCommand('copy');
  }
};

export default GeneralSettings;
