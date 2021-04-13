import { SettingKey, Settings, SettingSource } from './index';

const settingPrefix = 'settings-';

function get<P extends keyof Settings, T = Settings[P]>(settingKey: P): T | null {
  const localStorageValue = window.localStorage.getItem(settingPrefix + settingKey);
  const jsonValue = localStorageValue ? (JSON.parse(localStorageValue) as T[]) : undefined;
  return jsonValue?.[0] ?? null;
}

function set<P extends keyof Settings, T = Settings[P]>(settingKey: P, value: T): void {
  window.localStorage.setItem(settingPrefix + settingKey, JSON.stringify([value]));
}

function getAll(): Partial<Settings> {
  const settingKeys: SettingKey[] = Object.values(SettingKey);
  const allSettings = {} as Partial<Settings>;
  settingKeys.forEach((settingKey) => {
    const settingValue = get(settingKey);
    if (settingValue !== null) {
      allSettings[settingKey] = settingValue;
    }
  });
  return allSettings;
}

export const localStorageSettingSource: SettingSource = {
  get,
  set,
  getAll,
};
