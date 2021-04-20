import React, { useState } from 'react';

import clsx from 'clsx';

import AppLink from '../AppLink/AppLink';
import CornerGithubLink from '../CornerGithubLink/CornerGithubLink';
import GeneralSettings from '../GenerialSettings/GeneralSettings';
import SettingTabContent from '../SettingTabContent/SettingTabContent';
import UserDictSettings from '../UserDictSettings/UserDictSettings';
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
      <div className={styles.githubLinkContainer}>
        <CornerGithubLink />
      </div>
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
