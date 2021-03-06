export enum SettingKey {
  toolbarExpanded = 'toolbarExpanded',
  quickCopyMode = 'quickCopyMode',
}

export const defaultSettingValue = {
  toolbarExpanded: true,
  quickCopyMode: false,
};

export type Settings = typeof defaultSettingValue;

export interface SettingSource {
  get<K extends keyof Settings, T = Settings[K]>(settingKey: K): T | null;

  getAll(): Partial<Settings>;

  set<K extends keyof Settings, T = Settings[K]>(settingKey: K, value: T): void;
}
