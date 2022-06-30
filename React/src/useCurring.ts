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
    function: f,
    callbacks: [] as ((ev: E) => void)[],
    parameters: [] as T[],
  });
  const {callbacks, parameters} = ref.current;
  let index = 0;

  useEffect(() => {
    ref.current.function = f;
  }, deps);

  return (...val: UseCurringCallbackParameters<T>) => {
    if (!callbacks[index]) {
      const i = index;
      callbacks[i] = (ev: E) =>
        (ref.current.function as any)(...parameters[i], ev);
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
    function: f,
    callbacks: [] as ((ev: E) => void)[],
    parameters: [] as T[],
  });
  const {callbacks, parameters} = ref.current;
  let index = 0;

  useEffect(() => {
    ref.current.function = f;
  }, deps);

  return (...val: T) => {
    if (!callbacks[index]) {
      const i = index;
      callbacks[i] = (ev: E) =>
        (ref.current.function as any)(...parameters[i])(ev);
    }

    parameters[index] = val as T;
    return callbacks[index++];
  };
}

type UseCurringFunctionArgs<T> = T extends (
  ...args: infer P
) => (ev: any) => void
  ? P
  : T extends (...args: infer P) => void
  ? UseCurringCallbackParameters<P>
  : never;

export function useCurringFinal3<
  F extends (...args: any[]) => any,
  E extends SyntheticEvent,
>(f: F, deps: any[]) {
  type Parameters = UseCurringFunctionArgs<F>;

  const ref = useRef({
    function: f,
    callbacks: [] as ((ev: E) => void)[],
    parameters: [] as Parameters[],
  });
  const {callbacks, parameters} = ref.current;
  let index = 0;

  useEffect(() => {
    ref.current.function = f;
  }, deps);

  return (...val: Parameters) => {
    if (!callbacks[index]) {
      const i = index;
      callbacks[i] = (ev: E) => {
        const result = (ref.current.function as any)(...parameters[i], ev);
        return typeof result === 'function' ? result(ev) : result;
      };
    }

    parameters[index] = val as Parameters;
    return callbacks[index++];
  };
}
