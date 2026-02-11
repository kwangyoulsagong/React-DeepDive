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
