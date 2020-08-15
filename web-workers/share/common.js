
onconnect = function(e) {
  var port = e.ports[0];
  port.onmessage = function(e) {
    var workerResult = (e.data[0] + e.data[1]);
    port.postMessage(workerResult);
  }
}

// 利用workder 实现崩溃页面通知 -=================================

// const checkTime = 6 * 1000; // 每 6s 检查一次
// const crashTime = 15 * 1000; // 15s 超过15s没有心跳则认为已经 crash
// let timer
// let time

// onconnect = function(e) {
//   var port = e.ports[0];
//   port.onmessage = function(e) {
//     const data = e.data;
//     console.log(33333);
//     // 正常心跳，检测崩溃
//     if (data.from === 'b') {
//       if (data.type === 'running') {
//         time = Date.now();
//         if (!timer) {
//           timer = setInterval(function () {
//             if (data.from === 'b') {
//               const now = Date.now();
//               if ((now - time) > crashTime) {
//                 port.postMessage(['b页面崩溃啦', 'b页面崩溃啦2']);
//                 clearInterval(timer);
//                 timer = null;
//               } else {
//                 port.postMessage(['b页面还很正常', 'b页面还很正常']);
//               }
//             }
//           }, checkTime)
//         }
//       }
//     }
//   }
// }
