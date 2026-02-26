> 함수 컴포넌트에 대한 이해는 클로저에 달려 있습니다.. 함수 컴포넌트의 구조와 작동 방식, 훅의 원리, 의존성 배열 등 함수 컴포넌트의 대부분의 기술이 모두 클로저에 의존하기 때문입니다.

### 클로저의 정의

`클로저` 는 함수와 함수가 선언된 Lexical Scope(어휘적 환경) 조합이다.

- 어휘적 환경을 이해 하기 위한 예제 코드

```jsx
function add() {
  const a = 10;
  function innerAdd() {
    const b = 20;
    console.log(a + b);
  }
  innerAdd();
}
add();
```

add 함수 내부에 innerAdd가 있고, innerAdd 함수는 내부에서 b 변수를 선언한 뒤 함수 외부에 a와 b를 더해서 정삭적으로 30을 출력합니다.

a 변수의 유효 범위는 add 전체이고, b의 유효 범위는 innerAdddml 전체다. innerAdd는 add 내부에서 선언돼 있어 a를 사용할 수 있게 됩니다.

> `선언적 Lexical Scope(어휘적 환경)` 이라는 것은 변수가 코드 내부에서 어디서 선언됐는지를 말하는것이다.
> 따라서 호출 방식에 따라 동적으로 결정되는 `this` 와는 다르게 코드가 작성된 순간에 정적으로 결정된다.

### 변수의 유효 범위, 스코프

앞서 `클로저`는 변수의 유효 범위에 따라서 `Lexical Scope` 결정이 된다고 했습니다.

이러한 변수의 유효 범위를 `스코프(scope)` 라고 합니다.

**스코프 종류**

- 전역 스코프
  - 전역 레벨에 선언하는 것을 `전역 스코프(global scope)`라고 합니다..
  - 브라우저 환경에서는 window, node.js 환경에서는 global 이 객체에 전역 레벨에서 선언한 스코프가 바인딩 됩니다..

  ```jsx
  var global = "global scope";

  function hello() {
    console.log(global);
  }

  console.log(global); // global scope
  hello(); //global scope
  console.log(global === window.global); // true
  ```

- 함수 스코프
  - js는 기본적으로 함수 레벨 스코프를 따라서 { } 블록이 스코프 범위를 결정하지 않습니다.

  ```jsx
  if (true) {
    var global = "global scope";
  }

  console.log(global); // 'global scope'
  console.log(global === window.global); // true
  ```

  - 함수 레벨 스코프를 가지고 있어 `var global` 은 내부에 선언되어 있는데 외부에서도 접근이 가능합니다.

  ```jsx
  function hello() {
    var local = "local variable";
    console.log(local); // local variable
  }

  hello();
  console.log(local);
  ```

- 중첩 스코프
  ```jsx
  var x = 10;

  function foo() {
    var x = 100;
    console.log("function foo", x); // 100;

    function bar() {
      var x = 1000;
      console.log("nested bar function", x); // 1000
    }

    bar();
  }

  console.log("global", x); // 10
  foo();
  ```

  - 스코프는 가장 가까운 스코프에서 변수가 존재하는지를 먼저 확인해 같은 이름은 바깥을 가려버립니다.
  - Scope Chain에서 js 엔진이 변수를 찾는 순서는
  - 현재 스코프 → 부모 스코프 → 전역 스코프 순으로 찾습니다.

### 클로저의 활용

> 전역 스코프는 어디서든 원하는 값을 꺼내올 수 있다는 장점이 있지만, 반대로 이야기하면 누구든 접근할 수 있고 수정이 가능하다.

```jsx
var counter = 0;

function handleClick() {
  counter++;
}

handleClick();
console.log(counter);
```

`counter` 변수는 큰 문제를 가지고 있습니다.

- 전역 레벨에 선언돼 있어서 누구나 수정할 수 있다.
- 재사용이 어렵다
- 책임 단위가 명확하지 않다

따라서 리액트의 내부 상태 값은 리액트의 별도로 관리하는 클로저 내부에서만 접근할 수 있습니다.

```jsx
function Counter() {
  var count = 0;

  return {
    increase: () => ++count,
    decrease: () => --count,
    reset: () => (count = 0),
    counter: () => {
      console.log("counter에 접근");
      return count;
    },
  };
}

const c = Counter();
console.log(c.increase()); // 1
console.log(c.reset());
console.log(c.increase());
console.log(c.increase());
console.log(c.decrease());
console.log(c.counter());
```

이것을 통해 이점으로는

- counter 변수를 직접적으로 노출하지 않음으로써 사용자가 직접 수정하는 것을 막았습니다.
- 또한 접근하는 경우를 제한해 로그를 남기는 등의 부차적인 작업도 수행할 수 있게 합니다.
- 또한 counter 변수의 업데이트를 increase와 decrease로 제한해 무분별하게 변경되는 것을 막았습니다.
- 클로저를 통해 전역 스코프의 사용을 막고, 개발자가 원하는 정보만 개발자가 원하는 방향으로 노출시킬 수 있다는 장점이 있습니다.

### 리액트에서의 클로저

클로저의 원리를 사용하고 있는 대표적인 것 중 하나가 바로 useState입니다.

```jsx
function Component() {
  const [state, setState] = useState(0);

  function handleClick() {
    // useState 호출은 위에서 끝나지만,
    // setState는 계속 내부의 최신값(prev)을 알고 있다.
    // 이는 클로저를 활용했기 때문에 가능하다.
    setState((prev) => prev + 1);
  }
}
```

`useState` 함수의 호출은 Component 내부 첫 줄에서 종료됐는데, setState는 useState의 내부의 최신 값을 어떻게 계속해서 확인할 수 있을 까요? 그 이유는 클로저가 useState 내부에서 활용됐기 때문입니다. 외부 함수가 반환한 내부 함수는 외부 함수의 호출이 끝났음에도 자신이 선언된 외부 함수가 선언된 환경을 기억하기 때문에 계속해서 state 값을 사용할 수 있는 것입니다.

### 주의할 점

클로저를 사용할 때 주의 점

```jsx
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000 * i);
}
```

0초부터 5초까지 차례대로 5, 5, 5 ,5 ,5 가 출력 됩니다.

`var`는 함수 스코프를 따르기 때문에,

for문 안에서 선언된 `i`는 반복마다 새로 생성되지 않고 하나의 변수로 공유됩니다.

`setTimeout`의 콜백 함수는 for문이 종료된 이후 실행되며,

이 시점에서 `i`의 값은 이미 5로 증가해 있기 때문에

모든 콜백에서 동일하게 5가 출력됩니다.

**수정 방법 두 가지**

1. 함수 레벨이 아닌 블록 레벨 스코프를 갖는 let으로 수정

```jsx
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000 * i);
}
```

`let` 은 기본적으로 블록 레벨 스코프를 가지게 되므로 i 가 for문을 순회하면서 각각의 스코프를 갖게 되서 정상적으로 출력이 됩니다.

1. 클로저를 제대로 활용하는 방법

```jsx
for (var i = 0; i < 5; i++) {
  setTimeout(
    (
      (sec) => () =>
        console.log(sec)
    )(i),
    1000 * i,
  );
}
```

for 문 내부에 즉시 실행 익명 함수를 선언 했습니다. 이 즉시 실행 함수는 i를 인수로 받는데, 이 함수 내부에서는 이를 sec이라고 하는 인수에 저장해 두었다가 setTimeout의 콜백 함수에 넘기게 됩니다. 이렇게 되면 setTimeout의 콜백 함수가 바라보는 클로저는 즉시 실행 익명 함수가 되는데, 이 즉시 실행 익명 함수는 각 for 문마다 생성되고 실행되기를 반복합니다.

여기서 클로저가 생기는 지점은 이 부분

```jsx
(sec) => () => console.log(sec);
```

- 바깥 함수 `(sec) => { ... }` 는 **이미 실행 종료**
- 하지만 안쪽 함수 `() => console.log(sec)` 는
  - `sec`을 참조하고 있고
  - 나중에 실행됨

**이미 종료된 함수의 지역 변수를 참조하고 있으므로 클로저가 형성됩니다.**
