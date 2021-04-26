export function isComposing(event: KeyboardEvent): boolean {
  // noinspection JSDeprecatedSymbols
  return event.isComposing || event.keyCode === 229;
}
