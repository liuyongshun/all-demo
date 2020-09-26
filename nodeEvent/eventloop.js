const fs = require('fs')

const readStartTime = Date.now()

setTimeout(() => {
  console.log('延时8毫秒')
}, 8)
setTimeout(() => {
  console.log('延时200毫秒', `实际执行用时${Date.now() - readStartTime}`)
}, 200)

function someAsyncOperation(callback) {
  fs.readFile('./file.js', callback);
}

someAsyncOperation(() => {
  const timestart = Date.now()
  while (Date.now() - timestart < 500) {}
  console.log(`读取文件和执行回调耗时${Date.now() - readStartTime}`)
})

setTimeout(() => {
  console.log('延时0毫秒')
})
setImmediate(() => {
  console.log('setImmediate')
})