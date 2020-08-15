const checkTime = 6 * 1000; // 每 6s 检查一次
const crashTime = 15 * 1000; // 15s 超过15s没有心跳则认为已经 crash
let timer
let time

this.onmessage = (e) => {
  const data = e.data;
  // 正常心跳，检测崩溃
  if (data.type === 'running') {
    time = Date.now();
    if (!timer) {
      timer = setInterval(function () {
        const now = Date.now();
        if ((now - time) > crashTime) {
          console.log('页面崩溃啦');
          clearInterval(timer);
          timer = null;
        } else {
          console.log('页面还很正常');
        }
      }, checkTime)
    }
  }
}
