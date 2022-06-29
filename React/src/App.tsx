import { FC, memo, MouseEvent, PropsWithChildren, SyntheticEvent, useCallback, useEffect, useState } from 'react'
import './App.css'
import { useCurring, useCurringFinal1, useCurringFinal2 } from './useCurring'

const Button: FC<PropsWithChildren<{ onClick: any; }>> = memo(({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>
});

type a = SyntheticEvent
function App() {
  const [count, setCount] = useState(0);
  const [bool, setBool] = useState(false);

  useEffect(() => {
    const timer = setTimeout(setCount, 1000, count + 1);

    return () => clearTimeout(timer);
  }, [count]);

  const handler = useCurring((value: number) => () => {
    console.log('test', value);
  }, []);
  const handlerLast1 = useCurringFinal1((val1: number, val2: boolean, val3: string, ev: any) => {
    console.log('useCurringFinal1', val1, val2, val3, ev, count);
  }, []);
  const handlerLast2 = useCurringFinal2((val1: number, val2: boolean, val3: string) => (ev: any) => {
    console.log('useCurringFinal2', val1, val2, val3, ev, count);
  }, []);

  return (
    <div className="App">
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
      <button onClick={() => setBool(bool => !bool)}>Toggle</button>
    </div>
  )
}

export default App
