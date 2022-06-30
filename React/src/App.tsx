import { FC, memo, MouseEvent, PropsWithChildren, SyntheticEvent, useCallback, useEffect, useState } from 'react'
import './App.css'
import { useCurring, useCurringFinal1, useCurringFinal2, useCurringFinal3 } from './useCurring'

const Button: FC<PropsWithChildren<{ onClick: any; }>> = memo(({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>
});

type a = SyntheticEvent
function App() {
  const [count, setCount] = useState(0);
  const [bool, setBool] = useState(false);

  useEffect(() => {
    const timer = setTimeout(setCount, 3000, count + 1);

    return () => clearTimeout(timer);
  }, [count]);

  const handler = useCurring((value: number) => () => {
    console.log('test', value);
  }, []);
  const handlerLast1 = useCurringFinal1((val1: number, val2: boolean, val3: string, ev: any) => {
    console.log('useCurringFinal1', val1, val2, val3, ev, count);
  }, [count]);
  const handlerLast2 = useCurringFinal2((val1: number, val2: boolean, val3: string) => (ev: any) => {
    console.log('useCurringFinal2', val1, val2, val3, ev, count);
  }, []);
  const handlerLast3_1 = useCurringFinal3((val1: number, val2: boolean, val3: string) => (ev: any) => {
    console.log('useCurringFinal3-1', val1, val2, val3, ev, count);
  }, []);
  const handlerLast3_2 = useCurringFinal3((val1: number, val2: boolean, ev: SyntheticEvent) => {
    console.log('useCurringFinal3-2', val1, val2, ev, count);
  }, [count]);

  return (
    <div className="App">
      {count}
      <p style={{padding: 10}}>
        <Button onClick={handler(100)}>Click curring handler</Button>
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
    </div>
  )
}

export default App
