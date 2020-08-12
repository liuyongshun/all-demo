### 嵌入式 worker

Worker 可以载入单独的 JavaScript 脚本文件，也可以载入script标签形式

一个 script 元素没有 src 特性，并且它的 type 特性没有指定成一个可运行的 mime-type，那么它就会被认为是一个数据块元素，并且能够被 JavaScript 使用, 你能够以如下方式嵌入一个 worker

- 所以使用时 script 不应该具有src以及type应该是无法识别的类型

将script脚本内容生成 URL，再让 Worker 加载这个 URL

worker 子进程

```
<script id="worker" type="app/worker">
// 该脚本不会被 JS 引擎解析，因为它的 mime-type 是 text/js-worker。
  addEventListener('message', function () {
    postMessage('some message');
  }, false);
  // 剩下的 worker 代码写到这里。
</script>
```

主进程

```
var blob = new Blob([document.getElementById('#worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function (e) {
console.log(e, '同页面的worker')
};
```
### ServiceWorkers

ServiceWorkers 作为web应用程序、浏览器和网络（如果可用）之前的代理服务器。旨在创建有效的离线体验，拦截网络请求，以及根据网络是否可用采取合适的行动并更新驻留在服务器上的资源。他们还将允许访问推送通知和后台同步API。

