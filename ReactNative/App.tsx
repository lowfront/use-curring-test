/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {
  FC,
  memo,
  PropsWithChildren,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useCurring,
  useCurringFinal1,
  useCurringFinal2,
  useCurringFinal3,
} from './useCurring';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const TitleText: FC<PropsWithChildren<{}>> = ({children}) => (
  <Text style={{fontWeight: '700'}}>{children}</Text>
);
const Component = () => {
  return <Text>Component rendered: {Date.now()}</Text>;
};
const ComponentWithMemo: FC<{prop?: number}> = memo(() => {
  return <Text>Component rendered: {Date.now()}</Text>;
});
const ComponentWithChildren: FC<PropsWithChildren<{}>> = ({children}) => {
  return (
    <View>
      <Text>Component with children rendered: {Date.now()}</Text>
      {children}
    </View>
  );
};
const ComponentWithChildrenWithMemo = memo(ComponentWithChildren);

const ComponentWithTextProp: FC<{text: string; onPress?: any; prop?: any}> = ({
  text,
  onPress,
}) => {
  return (
    <Text onPress={onPress}>
      ComponentWithTextProp text: "{text}" rendered: {Date.now()}
    </Text>
  );
};

const ComponentWithTextPropWithMemo = memo(ComponentWithTextProp);

const ComponentWithTextChildren: FC<PropsWithChildren<{}>> = ({children}) => {
  return (
    <Text>
      {children} renderered {Date.now()}
    </Text>
  );
};

const ComponentWithTextChildrenWithMemo = memo(ComponentWithTextChildren);

const RerenderingBasic = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(setCount, 1000, count + 1);

    return () => clearTimeout(timer);
  }, [count]);

  return (
    <SafeAreaView>
      <View>
        <TitleText>Just Text</TitleText>
        <Text>Now: ${Date.now()}</Text>
        <TitleText>No memorized component</TitleText>
        <Component />
        <TitleText>Memorized component</TitleText>
        <ComponentWithMemo />
        <TitleText>
          Memorized component with changing prop every 3 seconds
        </TitleText>
        <ComponentWithMemo prop={Math.floor(count / 3)} />
        <TitleText>Memorized component text children</TitleText>
        <ComponentWithTextChildrenWithMemo>
          text children
        </ComponentWithTextChildrenWithMemo>
        <TitleText>Memorized component text array children</TitleText>
        <ComponentWithTextChildrenWithMemo>
          text children{' '}
        </ComponentWithTextChildrenWithMemo>
      </View>
    </SafeAreaView>
  );
};

const Rerendering = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(setCount, 1000, count + 1);

    return () => clearTimeout(timer);
  }, [count]);

  const now = Date.now();

  const MemorizedChildren = useMemo(
    () => (
      <>
        <Text>Children1</Text>
        <Text>Children2</Text>
        <Text>Children3</Text>
        <View>
          <Text>Children4</Text>
        </View>
      </>
    ),
    [],
  );

  const [s1, setS1] = useState(0);
  const cb = useCallback(() => {
    setS1(val => val + 1);
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <Text>Now: {now}</Text>
        <Text onPress={() => setCount(count + 1)}>Click</Text>
        <TitleText>Component</TitleText>
        <Component />
        <TitleText>ComponentWithMemo</TitleText>
        <ComponentWithMemo />
        <TitleText>ComponentWithMemo Rendering every 3 seconds</TitleText>
        <ComponentWithMemo prop={Math.floor(count / 3)} />
        <TitleText>ComponentWithChildren</TitleText>
        <ComponentWithChildren>
          <Text>Children</Text>
        </ComponentWithChildren>
        <TitleText>ComponentWithChildrenWithMemo</TitleText>
        <ComponentWithChildrenWithMemo>
          <Text>Children</Text>
        </ComponentWithChildrenWithMemo>
        <TitleText>
          ComponentWithChildrenWithMemo with memorized children
        </TitleText>
        <ComponentWithChildrenWithMemo>
          {MemorizedChildren}
        </ComponentWithChildrenWithMemo>
        <TitleText>ComponentWithTextProp</TitleText>
        <ComponentWithTextProp text="Text" />
        <TitleText>ComponentWithTextPropWithMemo</TitleText>
        <ComponentWithTextPropWithMemo text="Text memo" />
        <TitleText>
          ComponentWithTextPropWithMemo additional prop can click
        </TitleText>
        <ComponentWithTextPropWithMemo text="Text memo" onPress={cb} />
        <TitleText>
          ComponentWithTextPropWithMemo additional prop can click
        </TitleText>
        <ComponentWithTextPropWithMemo
          text="Text memo"
          onPress={cb}
          prop={s1}
        />
      </View>
    </SafeAreaView>
  );
};

const PressComponent: FC<PropsWithChildren<{onPress: any}>> = memo(
  ({onPress, children}) => {
    return (
      <Text onPress={onPress}>
        {children} rendered: {Date.now()}
      </Text>
    );
  },
);

const UseCurring = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(setCount, 1000, count + 1);

    return () => clearTimeout(timer);
  }, [count]);

  const handle1 = useCurring(
    (val: string) => (ev: any) => {
      console.log('handle1', val, ev.timeStamp);
    },
    [],
  );
  const handle2 = useCurringFinal1((val: string, bool: boolean, ev: any) => {
    console.log('useCurringFinal1', val, bool, ev.timeStamp);
  }, []);
  const handle3 = useCurringFinal2(
    (val: string, bool: boolean) => (ev: any) => {
      console.log('useCurringFinal2', val, bool, ev.timeStamp);
    },
    [],
  );
  const handle4 = useCurringFinal3(
    (val: string, bool: boolean) => (ev: any) => {
      console.log('useCurringFinal2', val, bool, ev.timeStamp);
    },
    [],
  );

  return (
    <SafeAreaView>
      <View>
        <PressComponent onPress={handle1('[useCurring]')}>
          useCurring
        </PressComponent>
        <PressComponent onPress={handle2('[new useCurring1]', true)}>
          new useCurring 1
        </PressComponent>
        <PressComponent onPress={handle3('[new useCurring2]', false)}>
          new useCurring 2
        </PressComponent>
        <PressComponent onPress={handle4('[new useCurring4]', false)}>
          new useCurring 3
        </PressComponent>
      </View>
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();

const Tab = () => {
  const navigation = useNavigation();
  const goto = useCurringFinal1((path: any) => {
    console.log(path);
    navigation.navigate(path);
  }, []);

  return (
    <View>
      <View style={styles.title}>
        <Text style={styles.titleText}>React Rerendering Test</Text>
      </View>
      <View style={styles.nav}>
        <View style={styles.navButton}>
          <Button title="Basic" onPress={goto('basic')} />
        </View>
        <View style={styles.navButton}>
          <Button title="All" onPress={goto('all')} />
        </View>
        <View style={styles.navButton}>
          <Button title="useCurring" onPress={goto('use-curring')} />
        </View>
      </View>
    </View>
  );
};

const Layout: FC<PropsWithChildren<{}>> = ({children}) => {
  return (
    <SafeAreaView>
      <Tab />
      {children}
    </SafeAreaView>
  );
};

const PageBasic = () => (
  <Layout>
    <RerenderingBasic />
  </Layout>
);
const PageAll = () => (
  <Layout>
    <Rerendering />
  </Layout>
);
const PageUseCurring = () => (
  <Layout>
    <UseCurring />
  </Layout>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="basic" component={PageBasic} />
        <Stack.Screen name="all" component={PageAll} />
        <Stack.Screen name="use-curring" component={PageUseCurring} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
  },
  nav: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navButton: {
    flex: 1,
  },
});

export default App;
