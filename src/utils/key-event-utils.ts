import React from 'react';

export function isComposing(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  // noinspection JSDeprecatedSymbols
  return event.nativeEvent.isComposing || event.keyCode === 229;
}
