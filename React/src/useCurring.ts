import {SyntheticEvent, useCallback, useEffect, useRef} from 'react';

export function useCurring<R, T extends unknown[]>(
  fn: (...arg: T) => R,
  deps: ReadonlyArray<unknown>,
) {
  const ref = useRef<T>();
  const callback = useCallback(() => fn(...(ref.current as T)), [...deps]);

  return useCallback(
    (...arg: T) => {
      ref.current = arg || [];

      return callback();
    },
    [callback],
  );
}

type LastItem<T extends any[]> = T extends [...infer A, any]
  ? T[A['length']]
  : never;
type ExceptLastItem<T extends any[]> = T extends [...infer A, any] ? A : never;

type UseCurringCallbackParameters<T extends any[]> =
  LastItem<T> extends SyntheticEvent ? ExceptLastItem<T> : T;

export function useCurringFinal1<T extends any[], E extends SyntheticEvent>(
    f: (...args: T) => void,
    deps: any[],
  ) {
  const ref = useRef({
    callbacks: [] as ((ev: E) => void)[],
    parameters: [] as T[],
  });
  const { callbacks, parameters } = ref.current;
  let index = 0;

  useEffect(() => {
    ref.current.callbacks = callbacks.map((_, index) => (ev: E) => (f as any)(...parameters[index], ev));
  }, deps);
  
  return (...val: UseCurringCallbackParameters<T>) => {
    if (!callbacks[index]) {
      const i = index;
      callbacks[i] = (ev: E) => (f as any)(...parameters[i], ev);
    }
    parameters[index] = val as T;
    return callbacks[index++];
  };
}

export function useCurringFinal2<T extends any[], E extends SyntheticEvent>(
    f: (...args: T) => (ev: E) => void,
    deps: any[],
  ) {
  const ref = useRef({
    callbacks: [] as ((ev: E) => void)[],
    parameters: [] as T[],
  });
  const { callbacks, parameters } = ref.current;
  let index = 0;

  useEffect(() => {
    ref.current.callbacks = callbacks.map((_, index) => (ev: E) => (f as any)(...parameters[index])(ev));
  }, deps);
  
  return (...val: T) => {
    if (!callbacks[index]) {
      const i = index;
      callbacks[i] = (ev: E) => (f as any)(...parameters[i])(ev);
    }

    parameters[index] = val as T;
    return callbacks[index++];
  };
}
