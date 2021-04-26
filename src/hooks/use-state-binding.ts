import { useCallback, useRef, useState } from 'react';

export function useStateBinding<T>(
  initialState: T,
  stateFromProps: T | undefined | null,
  onStateChange?: (state: T) => void,
): [T, (value: T | ((prefState: T) => T)) => void] {
  const [, markForRerender] = useState(initialState);

  const stateRef = useRef(initialState);
  const propRef = useRef(stateFromProps);

  const stateSetter = useCallback(
    (newState: T | ((prefState: T) => T)) => {
      const newStateValue = newState instanceof Function ? newState(stateRef.current) : newState;
      stateRef.current = newStateValue;
      onStateChange?.(newStateValue);
      const isStateBound = propRef.current !== undefined;
      if (!isStateBound) {
        markForRerender(newStateValue);
      }
    },
    [stateRef, onStateChange],
  );

  if (propRef.current !== stateFromProps) {
    stateRef.current = stateFromProps ?? stateRef.current;
    propRef.current = stateFromProps;
  }

  return [stateRef.current, stateSetter];
}
