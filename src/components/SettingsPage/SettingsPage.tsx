import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import GeneralSettings from '../GenerialSettings/GeneralSettings';
import SettingTabContent from '../SettingTabContent/SettingTabContent';
import UserDictSettings from '../UserDictSettings/UserDictSettings';
import './SettingPage.scss';

enum SettingTab {
  general = 'general',
  userDict = 'user-dict',
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(SettingTab.general);

  return (
    <div>
      <div className="ui top attached tabular menu">
        {renderTabButton(SettingTab.general, '一般設定')}
        {renderTabButton(SettingTab.userDict, '加字加詞')}
        <Link className="icon-button setting-page-close-button" to="/">
          <i className="close icon" />
        </Link>
      </div>
      <SettingTabContent active={activeTab === SettingTab.general}>
        <GeneralSettings />
      </SettingTabContent>
      <SettingTabContent active={activeTab === SettingTab.userDict}>
        <UserDictSettings />
      </SettingTabContent>
    </div>
  );

  function renderTabButton(id: SettingTab, text: string): JSX.Element {
    return (
      <button
        type="button"
        className={`setting-tab-button item${activeTab === id ? ' active' : ''}`}
        key={id}
        onClick={() => setActiveTab(id)}
      >
        {text}
      </button>
    );
  }
};

export default SettingsPage;
