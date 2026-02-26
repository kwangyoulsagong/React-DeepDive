### 이벤트 루프란?

v8 기준으로는 `이벤트 루프` 는 자바스크립트 런타임 외부에서 자바스크립트의 비동기 실행을 돕기 위해 만들어진 장치라고 볼 수 있습니다.

### 호출 스택과 이벤트 루프

`호출스택(call stack)` 은 자바스크립트에서 수행해야 할 코드나 함수를 순차적으로 담아두는 스택입니다.

```jsx
function bar() {
  console.log("bar");
}

function baz() {
  console.log("baz");
}

function foo() {
  console.log("foo");
  bar();
  baz();
}

foo();

실행 foo bar baz

```

```jsx
1. foo() 가 호출 스택에 먼저 들어간다.
2. foo() 내부에 console.log가 존재하므로 호출 스택에 들어간다.
3. 2의 실행이 완료된 이후에 console.log는 제거되고 다음 코드로 넘어간다. (아직 foo()는 존재)
4. bar()가 호출 스택에 들어간다.
5. bar() 내부에 console.log가 존재하므로 호출 스택에 들어간다.
6. 5의 실행이 완료된 이후에 console.log는 제거되고 다음 코드로 넘어간다.(아직 foo(), bar() 존재)
7. 더 이상 bar()에 남은 것이 없으므로 호출 스택에서 제거된다. (아직 foo() 존재)
8. baz()가 호출 스택에 들어간다.
9. baz() 내부에 console.log가 존재하므로 호출 스택에 들어간다.
10. 9의 실행이 완료된 이후에 console.log는 제거되고 다음 코드로 넘언간다. (아직 foo(), baz() 존재)
11. 더 이상 baz()에 남은 것이 없으므로 호출 스택에서 제거된다. (아직 foo()는 존재)
12. 더 이상 foo()에 남은 것이 없으므로 호출 스택에서 제거된다.
13. 이제 호출 스택이 완전히 비워졌다.
```

이 호출 스택이 비어 있는지 여부를 확인하는 것이 `이벤트 루프` 입니다.

`이벤트 루프` 는 단순히 이벤트 루프만의 단일 스레드 내부에서 이 호출 스택 내부에 수행해야 할 작업이 있는지 확인하고, 수행해야 할 코드가 있다면 자바스크립트 엔진을 이용해 실행합니다.

> **알아둘 점** `코드가 실행하는 것` 과 `호출 스택이 비어있는지 확인하는 것` 모두가 단일 스레드에서 일어난다는 점입니다. 즉,
> 두 작업은 동시에 일어날 수 없으며 한 스레드에서 순차적으로 일어납니다.

**비동기 작업 실행**

```jsx
function bar() {
  console.log("bar");
}

function baz() {
  console.log("baz");
}

function foo() {
  console.log("foo");
  setTimeout(bar, 0);
  baz();
}

foo();

실행 foo baz bar
```

```jsx
1. foo()가 호출 스택에 먼저 들어간다.
2. foo() 내부에 console.log가 존재하므로 호출 스택에 들어간다.
3. 2의 실행이 완료된 이후에 console.log는 제거되고 다음 코드로 넘어간다. (아직 foo()는 존재)
4. setTimeout(bar,0)이 호출 스택에 들어간다.
5. 4번에 대해 타이머 이벤트가 실행되며 태스크 큐로 들어가고, 그 대신 바로 스택에서 제거된다.
6. baz()가 호출 스택에 들어간다.
7. baz() 내부에 console.log가 존재하므로 호출 스택에 들어간다.
8. 7읠 실행이 완료된 이후에 console.log는 제거되고 다음 코드로 넘어간다. (아직 foo(), baz()는 존재)
9. 더 이상 baz()에 남은 것이 없으므로 호출 스택에서 제거된다. (아직 foo()는 존재)
10. 더 이상 foo()에 남은 것이 없으므로 호출 스택에서 제거된다.
11. 이제 호출 스택이 완전히 비워졌다.
12. 이벤트 루프가 호출 스택이 비워져 있다는 것을 확인했다. 그리고 태스크 큐를 확인하니 4번에 들어갔던 내용이 있어
		bar()를 호출 스택에 들여보낸다.
13. bar() 내부에 console.log()가 존재하므로 호출 스택에 들어간다.
14. 13의 실행이 끝나고, console.log는 제거되고 다음 코드로 넘어간다. (아직 bar() 존재)
15. 더 이상 bar()에 남은 것이 없으므로 호출 스택에서 제거된다.
```

보시다시피 setTimeout이 정확하게 0초 뒤에 실행된다는 것을 보장하지 못한다는 것을 이해하게 될 것 입니다.

`태스큐 큐` 란 실행해야 할 태스크의 집합을 의미합니다.

- 이벤트 루프는 태스크 큐를 한 개 이상 가지고 있습니다.
- 태스크 큐는 set 형태를 띠고 있습니다.
  - 선택된 큐 중에서 실행 가능한 가장 오래된 태스크를 가져와야 하기 때문입니다.

> **실행해야 할 태스크** 라는 것은 비동기 함수의 콜백 함수나 이벤트 핸들러 등을 의미합니다.

따라서 `이벤트 루프` 의 역할은 호출 스택에 실행 중인 코드가 있는지, 그리고 태스크 큐에 대기 중인 함수가 있는지 반복해서 확인하는 역할을 합니다.

> 호출 스택이 비어 있다면 태스크 큐에 대기중인 작업이 있는지 확인하고 이 작업을 실행 가능한 오래된 것부터 순차적으로 꺼내와서
> 실행하게 됩니다. 이 작업 또한 마찬가지로 태스크 큐가 빌 때까지 이루어집니다.

### 태스크 큐와 마이크로 태스크 큐

`이벤트 루프` 는 하나의 마이크로 태스크 큐를 갖고 있는데, 기존의 태스크 큐와는 다른 태스크를 처리합니다.

`마이크로 태스크`에는 대표적으로 `Promise` 가 있습니다. 이 마이크로 태스크 큐는 기존 태스크 큐보다 우선권을 갖습니다.

ex) setTimeout, setInterval은 Promise 보다 늦게 실행됩니다.

```jsx
 function foo() {
    console.log("foo");
  }

  function bar() {
    console.log("bar");
  }

  function baz() {
    console.log("baz");
  }

  setTimeout(foo, 0);

  Promise.resolve().then(bar).then(baz);

  실행 순서 bar -> baz -> foo
```

확실히 Promise가 우선권이 있음을 알 수 있습니다.

각 태스크에 들어가는 대표적인 작업은 다음과 같습니다.

- 태스크 큐 또는 매크로 태스크 큐: setTimeout, setInterval, setImmediate
- 마이크로 태스크 큐: process.nextTick, Promises, queueMicroTask, MutationObserver

> **렌더링은 언제 실행될까요?** 태스크일까요? 마이크로 태스크 큐일까요? 태스크 큐를 실행하기에 앞서
> 먼저 마이크로 태스크 큐를 실행하고, 이 마이크로 태스크 큐를 실행한 뒤에 렌더링이 일어납니다.
> 각 마이크로 태스크 큐 작업이 끝날 때마다 한 번씩 렌더링할 기회를 얻게 됩니다.

이유는

- JS는 한 번에 한 덩어리(매크로 태스크)를 실행한다
- 그 덩어리의 논리적 후속 작업(마이크로 태스크)은 **중간에 끊기면 안 된다**
- 렌더링은 비싸고 중간 상태는 의미 없다
- 그래서 **마이크로 태스크를 전부 끝낸 뒤**
- 브라우저가 “지금 그려도 되겠다” 판단하면 렌더링한다

```jsx
setTimeout(foo, 0);
Promise.resolve().then(bar).then(baz);
```

이 코드가 **동기적으로 실행되는 순간**:

1. `setTimeout(foo, 0)` 실행
   → `태스크 큐`에 foo 등록

2. `Promise.resolve().then(bar).then(baz)` 실행
   → `마이크로태스크 큐`에 bar 등록

**현재 상태**:

- 태스크 큐: [foo]
- 마이크로태스크 큐: [bar]

**이벤트 루프 동작**

1단계: 마이크로태스크 큐 처리 (우선순위 높음)

- 마이크로태스크 큐: [bar]
  → bar 실행 → "bar" 출력
  → .then(baz)가 이어서 마이크로태스크 등록
- 마이크로태스크 큐: [baz]
  → baz 실행 → "baz" 출력
- 마이크로태스크 큐: [] (비었음)

2단계: 렌더링 기회

- 마이크로태스크 큐가 비었으므로 렌더링 기회 부여 dom 요소가 변경되면 렌더링 가능

3단계: 태스크 큐 처리

- 태스크 큐: [foo]
  → foo 실행 → "foo" 출력
- 마이크로태스크 큐 확인: [] (비었음)
- 렌더링 기회 부여 dom 요소가 변경되면 렌더링 가능

### 동기 코드, 태스크 큐, 마이크로 태스크 큐와 렌더링과의 관계를 확인할 수 있는 코드

```html
<html>
  <body>
    <ul>
      <li>동기 코드: <button id="sync">0</button></li>
      <li>태스크, 매크로 태스크: <button id="macrotask">0</button></li>
      <li>마이크로 태스크: <button id="microtask">0</button></li>
    </ul>

    <button id="all">모두 동시 실행</button>
  </body>
  <script>
    const button = document.getElementById("run");
    const syncButton = document.getElementById("sync");
    const macrotaskButton = document.getElementById("macrotask");
    const microtaskButton = document.getElementById("microtask");

    const allButton = document.getElementById("all");

    // 동기 코드로 버튼에 1부터 렌더링
    syncButton.addEventListener("click", () => {
      for (let i = 0; i <= 100000; i++) {
        syncButton.innerHTML = i;
      }
    });

    // setTimeout으로 태스크 큐에 작업을 넣어서 1부터 렌더링
    macrotaskButton.addEventListener("click", () => {
      for (let i = 0; i <= 100000; i++) {
        setTimeout(() => {
          macrotaskButton.innerHTML = i;
        }, 0);
      }
    });

    // queueMicrotask 마이크로 태스크 큐에 넣어서 1부터 렌더링
    microtaskButton.addEventListener("click", () => {
      for (let i = 0; i <= 100000; i++) {
        queueMicrotask(() => {
          microtaskButton.innerHTML = i;
        });
      }
    });

    allButton.addEventListener("click", () => {
      for (let i = 0; i <= 100000; i++) {
        setTimeout(() => {
          macrotaskButton.innerHTML = i;
        }, 0);
        queueMicrotask(() => {
          microtaskButton.innerHTML = i;
        });
        syncButton.innerHTML = i;
      }
    });
  </script>
</html>
```

코드 결과를 정리하면

- 동기 코드는 100000까지 숫자가 올라가기 전까지는 렌더링이 일어나지 않다가 for 문이 끝나야 렌더링 기회를 얻어 100000이라는 숫자가 나타납니다.
- 태스크 큐(setTimeout)는 모든 setTimeout 콜백이 큐에 들어가기 전까지 잠깐의 대기 시간을 갖다가 1부터 100000까지 순차적으로 렌더링 되는 것을 볼 수 있습니다.
- 마이크로 태스크 큐(queueMicrotask)는 동기 코드와 마찬가지로 렌더링이 전혀 일어나지 않다가 100000까지 다 끝난 이후에야 한번 렌더링이 일어난다.
- 모든 것을 동시에 실행했을 경우 동기 코드와 마이크로 태스크 큐 코드만 한 번에 100000까지 올라가고, 태스크 큐만 앞선 예제처럼 순차적으로 렌더링되는 것을 볼 수 있다.

### requestAnimationFrame

브라우저에 다음 리페인트 전에 콜백 함수 호출을 가능하게 하는 `requestAnimationFrame` 으로 확인할 수 있습니다.

```jsx
console.log("a");

setTimeout(() => {
  console.log("b");
}, 0);

Promise.resolve().then(() => {
  console.log("c");
});

window.requestAnimationFrame(() => {
  console.log("d");
});

// 실행 순서 a -> c -> d -> b
```

`requestAnimationFrame` 은 브라우저에 렌더링하는 작업은 마이크로 태스크 큐 와 태스크 큐 사이에서 일어난다는 것을 알 수 있습니다.
