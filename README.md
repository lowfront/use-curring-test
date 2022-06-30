# useCurring 함수 메모이제이션 테스트

기존 [useCurring](https://github.com/ridi/ridi/blob/master/frontends/app/books-mobile/src/hooks/contentsHome/useCurring.tsx) 함수에서 메모이제이션이 작동하지 않아서 기존 요구사항을 최대한 반영하면서 메모이제이션이 적용되는 `useCurring` 훅을 만들기 위한 예제 프로젝트. React 테스트는 [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ko)의 `Highlight updates when components render` 기능을 활용해서 리렌더링 컴포넌트를 확인하고, ReactNative 테스트는 앱 실행 후 상단 `useCurring` 탭에서 각각의 훅이 사용된 컴포넌트 리렌더링 여부 확인.

## 기능요구
1. React 앱 최적화를 위해 생성되는 함수들은 메모이제이션 되어야 함
2. 파라미터만 다른 같은 함수를 useCallback으로 래핑해서 매번 새로 만드는 불편을 해소하고, 컴포넌트의 이벤트 핸들에 직접 파라미터를 입력해 호출해서 파라미터가 고정된 핸들을 생성
3. 핸들을 생성하는 함수도 prop을 통해서 전달해서 컴포넌트 내부에서 사용 가능
4. 핸들을 생성하기 위한 파라미터가 변경되더라도 문제없이 작동

## 기존 hook 문제점
- 2번 요구사항 처리과정에서 핸들 생성시 매번 새로운 핸들 함수가 prop으로 전달되어 리렌더링 유발
- 3번 요구사항의 경우 훅을 넘길때는 메모이제이션이 작동하지만 결국 사용하기 위해 핸들을 생성해야하는데 핸들을 생성하는 경우 새로운 핸들함수가 prop으로 전달되어 리렌더링을 유발
## 해결 방법
- 리렌더링을 방지하기 위해 핸들을 생성하기 위한 함수와 핸들함수를 모두 필요한 만큼만 생성하고 같은 객체를 재활용해서 사용
- 사용되는 핸들의 개수는 컴포넌트 렌더링시 결정 되는 것을 이용해서 핸들 생성함수가 호출된 순서를 인덱스로 활용하여 사용해야하는 파라미터를 결정하는 함수를 저장하고 재활용(리렌더링 방지)
- 핸들에 동적 파라미터를 허용하기 위해, 리렌더링시 저장된 인덱스를 0으로 수정하여 파라미터를 호출된 인덱스에 맞게 새로 저장
- 의존성 변경시 콜백함수를 업데이트
- 컴포넌트 제거시 ref가 삭제되며 메모리 정리