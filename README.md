# React와 History API 사용하여 SPA Router 기능 구현하기

## 요구사항

**1) 해당 주소로 진입했을 때 아래 주소에 맞는 페이지가 렌더링 되어야 한다.**

- `/` → `root` 페이지
- `/about` → `about` 페이지

**2) 버튼을 클릭하면 해당 페이지로, 뒤로 가기 버튼을 눌렀을 때 이전 페이지로 이동해야 한다.**

- 힌트) `window.onpopstate`, `window.location.pathname` History API(`pushState`)

**3) Router, Route 컴포넌트를 구현해야 하며, 형태는 아래와 같아야 한다.**

```tsx
ReactDOM.createRoot(container).render(
  <Router>
    <Route path='/' component={<Root />} />
    <Route path='/about' component={<About />} />
  </Router>
);
```

**4) 최소한의 push 기능을 가진 useRouter Hook을 작성한다.**

```tsx
const { push } = useRouter();
```

<br /><br />

## 구현

### 실행

```
npm install
npm run dev
```

### 프로젝트 구조

```
src
 ┣ components
 ┃ ┗ About.tsx
 ┣ hooks
 ┣ ┣ usePath.tsx
 ┃ ┗ useRouter.tsx
 ┣ router
 ┣ ┣ index.ts
 ┣ ┣ Route.tsx
 ┃ ┗ Router.tsx
 ┣ App.tsx
 ┣ index.css
 ┗ main.tsx
```

### usePath.tsx

브라우저의 현재 경로를 추적하는 hook

```
const usePath = () => {
  // 초기값으로 현재 브라우저의 경로를 설정합니다.
  const [path, setPath] = useState(window.location.pathname)

  // 현재 브라우저의 경로를 가져와 path state를 업데이트합니다.
  const updatePath = () => {
    setPath(window.location.pathname)
  }

  // 컴포넌트 마운트 시이 벤트 리스너를 추가합니다.
  useEffect(() => {
    // 'popstate' 이벤트가 발생하면
    // updatePath 함수를 호출하여 path state를 업데이트합니다.
    window.addEventListener('popstate', updatePath)

     // 컴포넌트 언마운트 시 이벤트 리스너를 제거하여 메모리 누수를 방지합니다.
    return () => {
      window.removeEventListener('popstate', updatePath)
    }
  }, [])

  // 현재 경로를 반환합니다.
  return path
}

```

### useRouter.tsx

브라우저의 현재 경로를 변경하는 hook

```
const useRouter = () => {

  // 전달 받은 path를 history.pushState에 url로 전달합니다.
  // dispatchEvent를 통해 listen 중인 'popstate' 이벤트를 실행합니다.

  const push = (path: string) => {
    // 경로를 인자로 받아 history API를 사용해 브라우저의 현재 경로를 변경합니다.
    history.pushState(null, '', path)

    // 'popstate'는 웹 브라우저에서 '뒤로 가기'나 '앞으로 가기'같은 방식으로 페이지 이동을 할 때 발생합니다.
    // 새로운 경로로 이동했음을 알리기 위해 'popstate' 이벤트를 수동으로 발생시킵니다.
    window.dispatchEvent(new Event('popstate'))
  }

  // push 함수를 반환합니다.
  return { push }
}

```

### Route.tsx

경로와 해당 경로에서 렌더링 할 컴포넌트를 연결하는 컴포넌트

```
// Route 컴포넌트에서 props로 라우팅될 때 사용하는 경로와 해당 경로에서 렌더링 할 component를 받습니다.
export interface RouteProps {
  path: string;
  component: React.ReactNode;
}

const Route = ({ component }: RouteProps) => {
  // 받은 component prop을 렌더링합니다.
  return <>{component}</>;
};

```

### Router.tsx

현재 브라우저의 경로를 확인하고, 그에 맞는 Route 컴포넌트를 렌더링하는 컴포넌트

```
const Router = ({ children }: RouterProps) => {

  // usePath 훅을 사용해 현재 브라우저의 경로를 가져옵니다.
  const currentPath = usePath();

  return (
    <>
      // Router 컴포넌트로 감싸진 자식 컴포넌트를 순회합니다.
      {children?.map((router: React.ReactElement<RouteProps>) => {
        // 만약 자식 컴포넌트의 path prop이 현재 브라우저의 경로와 일치한다면
        // 해당 자식 컴포넌트를 렌더링합니다.
        if (router.props.path == currentPath) return router;
      })}
    </>
  );
};

```

<br /><br />

## 새롭게 배운 점

### `history.pushState`와 `popstate`

- **history.pushState**

  `history.pushState`는 history API를 조작하는 데 사용되는 메서드이며, 이를 통해 브라우저의 세션 기록 스택에 상태를 추가하고 URL을 변경할 수 있습니다. 이 메서드는 SPA에서 주로 사용됩니다. 이 메서드를 사용하면 현재 페이지의 URL을 새로운 URL로 변경할 수 있지만 페이지의 새로고침 없이 실제 페이지 로드는 일어나지 않습니다.

- **popstate**

  `popstate`는 `window` 객체에서 발생하는 이벤트입니다. 이 이벤트는 사용자가 브라우저의 '뒤로' 또는 '앞으로' 버튼을 클릭하여 세션 기록 스택을 탐색할 때 발생합니다. `popstate` 이벤트는 사용자의 탐색에 응답하여 웹 애플리케이션의 상태를 변경하거나 업데이트하는 데 사용될 수 있습니다.

따라서 `history.pushState`는 history API를 조작하는 메서드이지만, `popstate`는 history API의 변화에 반응하는 이벤트입니다.
