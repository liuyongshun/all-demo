const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  console.log('worker do something')
}
// ===============================
// 基于 egg 的架构,简单模仿 cluster 设计和思想


// cluster()集群 是什么:

// - 在服务器上同时启动多个进程

// - 每个进程里都跑的是同一份源代码（好比把以前一个进程的工作分给多个进程去做）

// - 这些进程可以同时监听一个端口

// master-worker 进程模式

// 负责启动其他进程的叫做 Master 进程，不做具体的工作，只负责启动其他进程

// 其他被启动的叫 Worker 进程，它们接收请求，对外提供服务

// Worker 进程的数量一般根据服务器的 CPU 核数来定，这样就可以完美利用多核资源

// ```
// const cluster = require('cluster');
// const http = require('http');
// const numCPUs = require('os').cpus().length;

// if (cluster.isMaster) {
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
// } else {
//   console.log('worker do something')
// }
// ```

// 上面代码运行后,会打印8个(根据cpu核数) `worker do something`,而这块就是我们要处理的业务代码,创建了8个进程

// 这样简单的 `master-workder` 模式就形成了

// **考虑代码的稳定性,我们需要对异常进行处理,并保证代码总能稳定运行**

// 导致进程退出的两类原因:

// 1. 代码抛出了异常没有被捕获到时，进程将会退出，此时 Node.js 提供了 process.on('uncaughtException', handler) 接口来捕获它

// 2. 进程出现异常导致 crash 或者 OOM 被系统杀死

// 面对异常如何解决:

// - 关闭异常 Worker 进程所有的 TCP Server（将已有的连接快速断开，且不再接收新的连接），断开和 Master 的 IPC 通道，不再接受新的用户请求。

// - Master 立刻 fork 一个新的 Worker 进程，保证在线的『工人』总数不变。

// - 异常 Worker 等待一段时间，处理完已经接受的请求后退出

// 代码:


// Worker 进程异常退出以后该如何处理？
// 多个 Worker 进程之间如何共享资源？
// 多个 Worker 进程之间如何调度？
// ...