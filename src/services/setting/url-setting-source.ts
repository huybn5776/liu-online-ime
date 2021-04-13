import * as R from 'ramda';

import { isNilOrEmpty } from '../../utils/object-utils';
import { Settings, SettingSource } from './index';

function get<P extends keyof Settings, T = Settings[P]>(settingKey: P): T | null {
  const settings = getAll();
  return (settings[settingKey] as unknown) as T;
}

function set(): void {
  //  cannot update setting while settings is load from url
}

function getAll(): Partial<Settings> {
  const base64String = new URL(window.location.href).searchParams.get('settings');
  if (!base64String) {
    return {};
  }
  return R.pipe(atob, decodeURIComponent, JSON.parse)(base64String) as Settings;
}

function settingsToBase64String(settings: Partial<Settings>): string | null {
  if (isNilOrEmpty(settings)) {
    return null;
  }
  return R.pipe(JSON.stringify, encodeURIComponent, btoa)(settings);
}

export const urlSettingSource: SettingSource & {
  settingsToBase64String: typeof settingsToBase64String;
} = {
  get,
  set,
  getAll,
  settingsToBase64String,
};
