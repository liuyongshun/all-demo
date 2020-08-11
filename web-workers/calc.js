importScripts('sub.js');
console.log(getAll());
this.onmessage = function(e) {
  const data = e.data;
  const count = data.count;
  const result = fibonacci(count);
  // 子进程终止
  // close();
  console.log(result);
  // 计算完成的结果回传到主进程
  postMessage(result);
}

// 密集型计算
function fibonacci (n) {
  if (n==0 || n == 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}
