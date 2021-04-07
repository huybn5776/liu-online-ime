export interface CharMapping {
  id?: number;
  code: string;
  char: string;
}

export type CharMappingDict = Record<string, string[]>;
