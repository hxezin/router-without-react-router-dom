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

```
const usePath = () => {
  const [path, setPath] = useState(window.location.pathname)

  // updatePath 이벤트 실행 시 path state 값을 window.location.pathname으로 업데이트합니다.
  const updatePath = () => {
    setPath(window.location.pathname)
  }

  // 마운트 시 'popstate' 이벤트를 listen 합니다.
  // 언마운트 시 'popstate' 이벤트를 제거합니다.
  useEffect(() => {
    window.addEventListener('popstate', updatePath)
    return () => {
      window.removeEventListener('popstate', updatePath)
    }
  }, [])

  // usePath에서 path를 반환합니다.
  return path
}

```

## useRouter.tsx

```
const useRouter = () => {

  // 전달 받은 path를 history.pushState에 url로 전달합니다.
  // dispatchEvent를 통해 listen 중인 'popstate' 이벤트를 실행합니다.
  const push = (path: string) => {
    history.pushState(null, '', path)
    window.dispatchEvent(new Event('popstate'))
  }

  // push 함수를 반환합니다.
  return { push }
}

```

## Route.tsx

```
// Route 컴포넌트에서 props로 path와 component를 전달 받습니다.
export interface RouteProps {
  path: string;
  component: React.ReactNode;
}

const Route = ({ component }: RouteProps) => {
  return <>{component}</>;
};

```

## Router.tsx

```
// Router 컴포넌트로 감싸진 children 컴포넌트 리스트를 map으로 돌립니다.
// usePath로 currentPath를 정의하고, children 컴포넌트의 path와 비교하여 값이 같은 경우 해당 컴포넌트를 반환합니다.
const Router = ({ children }: RouterProps) => {
  const currentPath = usePath();
  return (
    <>
      {children?.map((router: React.ReactElement<RouteProps>) => {
        if (router.props.path == currentPath) return router;
      })}
    </>
  );
};

```

<br /><br />

## 새롭게 배운 점

### `history.pushState`와 `popstate`

`history.pushState`와 `popstate`는 웹 브라우저의 `history API`를 조작하는 데 사용되는 메서드이며 SPA에서 주로 사용됩니다.

- **history.pushState**

  `history.pushState` 메서드는 브라우저의 세션 기록 스택에 새로운 상태를 추가합니다. 이 메서드는 세 가지 인자(state object, title, URL)를 받습니다. 이 메서드를 사용하면 현재 페이지의 URL을 새로운 URL로 변경할 수 있지만 페이지의 새로고침 없이 실제 페이지 로드는 일어나지 않습니다.

- **popstate**

  `popstate` 이벤트는 사용자가 브라우저의 '뒤로' 또는 '앞으로' 버튼을 클릭하여 히스토리 엔트리를 이동할 때마다 발생합니다. `history.pushState`나 `history.replaceState`로 변경된 history 엔트리에 대해서도 이 이벤트가 발생합니다.

요약하면 `history.pushState`는 브라우저 히스토리 스택에 상태를 추가하며 URL을 변경하지만 페이지를 로드하지 않습니다. 반면 `popstate` 이벤트는 사용자가 브라우저의 '뒤로' 또는 '앞으로' 버튼을 클릭할 때 발생하며, 이벤트를 통해 웹 애플리케이션의 상태를 변경하거나 업데이트 할 수 있습니다.
