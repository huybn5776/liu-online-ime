import * as R from 'ramda';

export const isNilOrEmpty = R.either(R.isEmpty, R.isNil) as (value: unknown) => value is null | undefined;
export const isNotNilOrEmpty = R.complement(isNilOrEmpty) as (value: unknown) => value is Record<string, unknown>;

export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function defaultIfNil<T>(value: T, defaultValue: T): T {
  return R.isNil(value) ? defaultValue : value;
}

export function getPathValue<T, V>(path: string, obj: T): V {
  return R.path(path.split('.'), obj) as V;
}

export function setPathValue<T extends Record<string, unknown>, V>(path: string, value: V, obj: T): T {
  return R.assocPath(path.split('.'), value, obj);
}

export function deletePathValue<T extends Record<string, unknown>>(path: string, obj: T): T {
  return R.dissocPath(path.split('.'), obj);
}
