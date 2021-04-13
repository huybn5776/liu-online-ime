import { isNilOrEmpty } from '../../utils/object-utils';
import { defaultSettingValue, Settings, SettingSource } from './index';
import { localStorageSettingSource } from './local-storage-setting-source';
import { urlSettingSource } from './url-setting-source';

const settingSource = getSettingSource();

function getSettingSource(): SettingSource {
  if (new URL(window.location.href).searchParams.get('settings')) {
    return urlSettingSource;
  }
  return localStorageSettingSource;
}

export function getSetting<P extends keyof Settings, T = Settings[P]>(settingKey: P): T {
  return settingSource.get(settingKey) ?? ((defaultSettingValue[settingKey] as unknown) as T);
}

export function setSetting<P extends keyof Settings, T = Settings[P]>(settingKey: P, value: T): void {
  settingSource.set(settingKey, value);
}

export function getAllSettings(): Partial<Settings> {
  return settingSource.getAll();
}

export function getAllSettingsAsBase64String(): string | null {
  const settings = localStorageSettingSource.getAll();
  if (isNilOrEmpty(settings)) {
    return null;
  }

  return urlSettingSource.settingsToBase64String(settings);
}
