// Call Stack
console.log("-----call stack-----");

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

// 실행 순서 foo -> bar -> baz

// Asynchronous
console.log("-----asynchronous-----");

function abar() {
  console.log("bar");
}

function abaz() {
  console.log("baz");
}

function afoo() {
  console.log("foo");
  setTimeout(abar, 0);
  abaz();
}

afoo();

// 실행 순서 foo -> baz -> bar

// MicroTask Queue and Task Queue
setTimeout(() => {
  console.log("-----microtask queue and task queue-----");

  function mfoo() {
    console.log("foo");
  }

  function mbar() {
    console.log("bar");
  }

  function mbaz() {
    console.log("baz");
  }

  setTimeout(mfoo, 0);

  Promise.resolve().then(mbar).then(mbaz);
}, 0);

// 실행 순서 bar -> baz -> foo
