import React, { useState } from 'react';

import clsx from 'clsx';

import AppLink from '@components/AppLink/AppLink';
import GeneralSettings from '@components/GenerialSettings/GeneralSettings';
import GithubLink from '@components/GithubLink/GithubLink';
import SettingTabContent from '@components/SettingTabContent/SettingTabContent';
import UserDictSettings from '@components/UserDictSettings/UserDictSettings';

import styles from './SettingPage.module.scss';

enum SettingTab {
  general = 'general',
  userDict = 'user-dict',
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(SettingTab.general);

  return (
    <div className={styles.SettingsPage}>
      <div className="ui top attached tabular menu">
        {renderTabButton(SettingTab.general, '一般設定')}
        {renderTabButton(SettingTab.userDict, '加字加詞')}
        <GithubLink className={styles.settingTabButton} />
        <AppLink className={clsx(styles.iconButton, styles.settingPageCloseButton)} to="/" withParas>
          <i className={clsx('close', 'icon', styles.closeIcon)} />
        </AppLink>
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
        className={clsx('item', styles.settingTabButton, { active: activeTab === id })}
        key={id}
        onClick={() => setActiveTab(id)}
      >
        {text}
      </button>
    );
  }
};

export default SettingsPage;
