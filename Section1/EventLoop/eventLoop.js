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
