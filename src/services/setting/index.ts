export enum SettingKey {
}

export const defaultSettingValue = {
};

export type Settings = typeof defaultSettingValue;

export interface SettingSource {
  get<K extends keyof Settings, T = Settings[K]>(settingKey: K): T | null;

  getAll(): Partial<Settings>;

  set<K extends keyof Settings, T = Settings[K]>(settingKey: K, value: T): void;
}
