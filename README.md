# useCurring 함수 메모이제이션 테스트

기존 [useCurring](https://github.com/ridi/ridi/blob/master/frontends/app/books-mobile/src/hooks/contentsHome/useCurring.tsx) 함수에서 메모이제이션이 작동하지 않아서 기존 요구사항을 최대한 반영하면서 메모이제이션이 적용되는 `useCurring` 훅을 만들기 위한 예제 프로젝트. React 테스트는 [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ko)의 `Highlight updates when components render` 기능을 활용해서 리렌더링 컴포넌트를 확인하고, ReactNative 테스트는 앱 실행 후 상단 `useCurring` 탭에서 각각의 훅이 사용된 컴포넌트 리렌더링 여부 확인.

## 메모이제이션이 적용되지 않는 이유
기존 `useCurring` 훅은 훅 호출 후 리턴값으로 핸들 함수를 반환하는 함수를 반환함. 이는 파라미터별로 `useCallback`을 이용해 핸들 함수를 따로 만들어야하는 불편함을 해소하고 고정된 파라미터값을 갖는 핸들 함수를 메모이제이션 하기 위한 목적으로 보임. 문제는 핸들함수에 해당하는 훅의 첫번째 매개변수 `fn`이 호출시 새로운 함수를 반환하는 형태라는 점임. 컴포넌트 리렌더링시 `callback`변수가 호출되면서 `fn(...(ref.current as T))`가 호출되어 파라미터가 고정된 핸들 함수가 생성되는데 생성된 핸들함수는 메모이제이션이 적용되지 않은 새로운 함수이기 때문에 prop으로 전달된 컴포넌트의 리렌더링을 유발하게 됨.

## 메모이제이션을 적용하기 위해 사용한 방법
컴포넌트의 prop으로 전달되는 함수가 메모이제이션 되기 위해서는 함수가 같은 객체여야함. 컴포넌트 리렌더링시 핸들 생성함수의 호출 순서는 동일하기 때문에 호출 순서로 인덱스를 감지하고 배열의 인덱스 영역에 핸들에 연결할 함수를 저장하고 같은 인덱스를 이용해 파라미터도 배열로 관리했음. 함수 호출 형태는 호출시 배열 인덱스에서 파라미터를 조회해 스프레드 연산자로 매개변수를 입력해서 호출하는 형태로 저장되고 의존성이 변경되면 새로운 함수를 같은 방식으로 래핑해서 핸들 함수들이 저장된 배열을 얕은 복사해서 대체. 이러한 방식 때문에 핸들을 생성하기 위한 매개변수가 변경되는 경우에는 호출되는 매개변수가 달라짐에도 리렌더링을 유발하지 않음.
