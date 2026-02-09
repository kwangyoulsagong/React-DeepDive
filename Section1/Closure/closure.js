// Lexical Scope
console.log("-----lexical scope-----");
function add() {
  const a = 10;
  function innerAdd() {
    const b = 20;
    console.log(a + b); // 30
  }
  innerAdd();
}
add();

// Global Scope
console.log("-----global scope-----");
var global = "global scope";

function hello() {
  console.log(global);
}

console.log(global); // global scope
hello(); // global scope
// console.log(global === window.global) // true

// Function Scope
console.log("-----function scope-----");
if (true) {
  var global = "global";
}
console.log(global); // global

// Nested Scope
console.log("-----nested scope-----");
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

// Closure Use Case
console.log("-----closure use case -----");

// Using With Global Scope
console.log("-----using with global scope-----");
var counter = 0;

function handleClick() {
  counter++;
}

handleClick();
console.log(counter);

// Using With Function Scope
console.log("----using with function scope-----");

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
console.log(c.increase());
console.log(c.reset());
console.log(c.increase());
console.log(c.increase());
console.log(c.decrease());
console.log(c.counter());

// Using Closure In React
console.log("-----using closure in react-----");
const useState = (value) => {
  let state = value;
  const getState = () => state;
  const setState = (next) => {
    if (typeof next === "function") {
      state = next(state);
      return;
    }
    state = next;
  };
  return [getState, setState];
};

function Component() {
  const [state, setState] = useState(0);
  console.log("before setState", state());

  function handleClick() {
    // useState 호출은 위에서 끝나지만,
    // setState는 계속 내부의 최신값(prev)을 알고 있다.
    // 이는 클로저를 활용했기 때문에 가능하다.
    setState((prev) => prev + 1);
  }

  handleClick();
  console.log("after setState", state());
}

Component();

// Warning
console.log("-----warning-----");

// function scope forLoop with macrotask queue
console.log("-----function scope forLoop with macrotask queue-----");
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000 * i);
}

// block scope forLoop with macrotask queue
setTimeout(() => {
  console.log("-----block scope forLoop with macrotask queue-----");
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      console.log(i);
    }, 1000 * i);
  }
}, 5000);

// using proper closure in function scope forLoop with macrotask queue
setTimeout(() => {
  console.log(
    "-----using proper closure in function scope forLoop with macrotask queue-----",
  );
  for (var i = 0; i < 5; i++) {
    setTimeout(
      (
        (sec) => () =>
          console.log(sec)
      )(i),
      1000 * i,
    );
  }
}, 10000);
