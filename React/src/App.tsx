import { FC, memo, MouseEvent, PropsWithChildren, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { useCurring, useCurringFinal1, useCurringFinal2, useCurringFinal3, useCurringFinal4, useCurringFinal5, useCurringV3 } from './useCurring'

const Button: FC<PropsWithChildren<{ onClick: any; label?: string; }>> = memo((props) => {
  const { onClick, children, label } = props;

  return <button onClick={onClick}>{label || children}</button>
});

const Buttons: FC<{ list: number[]; useHandle: any }> = memo(({ list, useHandle: useHandle }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(setCount, 500, count + 1);

    return () => clearTimeout(timer);
  }, [count]);

  const handle = useHandle();
  return <div>
    <div>{count}</div>
    {list.map((_, i) => {
      return <Button onClick={handle(i, false)} key={`test-item-${i}`}>{`Click ${i}`}</Button>
    })}</div>;
});

type a = SyntheticEvent
function App() {
  const [count, setCount] = useState(0);
  const [bool, setBool] = useState(false);

  useEffect(() => {
    const timer = setTimeout(setCount, 1000, count + 1);

    return () => clearTimeout(timer);
  }, [count]);

  const handler = useCurringV3((value: number) => () => {
    console.log('test', value);
  }, []);
  const handlerLast1 = useCurringFinal1((val1: number, val2: boolean, val3: string, ev: any) => {
    console.log('useCurringFinal1', val1, val2, val3, ev, count);
  }, [count]);
  const handlerLast2 = useCurringFinal2((val1: number, val2: boolean, val3: string) => (ev: any) => {
    console.log('useCurringFinal2', val1, val2, val3, ev, count);
  }, [count]);
  const handlerLast3_1 = useCurringFinal4((val1: number, val2: boolean, val3: string) => (ev: any) => {
    console.log('useCurringFinal3-1', val1, val2, val3, ev.type, count);
  }, []);
  const handlerLast3_2 = useCurringFinal5((val1: number, val2: boolean, ev: SyntheticEvent) => {
    console.log('useCurringFinal3-2', val1, val2, ev, count);
  }, [count]);

  const array = useMemo(() => Array(10 + (Math.floor(count / 3) % 3)).fill(0), [Math.floor(count / 3)]);

  return (
    <div className="App">
      {count}
      <p style={{padding: 10}}>
        <Button onClick={handler(100)}>Click curring handler</Button>
        <Button onClick={handler(1000)}>Click curring handler</Button>
      </p>
      <p style={{padding: 10}}>
        <Button onClick={handlerLast1(10, false, 'test' + bool)}>Click new curring 1 handler</Button>
        <Button onClick={handlerLast1(101, true, 'abc' + bool)}>Click new curring 1 handler</Button>
      </p>
      <p style={{padding: 10}}>
        <Button onClick={handlerLast2(10, false, 'test' + bool)}>Click new curring 2 handler</Button>
        <Button onClick={handlerLast2(101, true, 'abc' + bool)}>Click new curring 2 handler</Button>
      </p>
      <p style={{padding: 10}}>
        <Button onClick={handlerLast3_1(10, false, 'test' + bool)}>Click new curring 3-1 handler</Button>
        <Button onClick={handlerLast3_1(101, true, 'abc' + bool)}>Click new curring 3-1 handler</Button>
      </p>
      <p style={{padding: 10}}>
        <Button onClick={handlerLast3_2(10, false)}>Click new curring 3-2 handler</Button>
        <Button onClick={handlerLast3_2(101, true)}>Click new curring 3-2 handler</Button>
      </p>
      <button onClick={() => setBool(bool => !bool)}>Toggle</button>
      <p style={{padding: 10}}>
      {array.map((_, i) => {
        return <Button onClick={handlerLast3_1(i, false, 'test')} key={`test-item-${i}`} label={`Click ${i}`}/>
      })}
      </p>
      <Buttons list={array} useHandle={handlerLast3_2.clone} />
    </div>
  )
}

export default App


type K = () => void;

type B<T = any> = T extends K ? never : T;
