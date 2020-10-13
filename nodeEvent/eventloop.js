// const fs = require('fs')

// const readStartTime = Date.now()

// setTimeout(() => {
//   console.log('延时8毫秒')
// }, 8)
// setTimeout(() => {
//   console.log('延时200毫秒', `实际执行用时${Date.now() - readStartTime}`)
// }, 200)

// function someAsyncOperation(callback) {
//   fs.readFile('./file.js', callback);
// }

// someAsyncOperation(() => {
//   const timestart = Date.now()
//   while (Date.now() - timestart < 500) {}
//   console.log(`读取文件和执行回调耗时${Date.now() - readStartTime}`)
// })

// setTimeout(() => {
//   console.log('延时0毫秒')
// })
// setImmediate(() => {
//   console.log('setImmediate')
// })


//
console.log(1);

setTimeout(() => {
  console.log(2);
  process.nextTick(() => {
  console.log(3);
  });
  new Promise((resolve) => {
    console.log(4);
    resolve();
  }).then(() => {
    console.log(5);
  });
});

new Promise((resolve) => {
  console.log(7);
  resolve();
}).then(() => {
  console.log(8);
});

process.nextTick(() => {
  console.log(6);
});

setTimeout(() => {
  console.log(9);
  process.nextTick(() => {
    console.log(10);
  });
  new Promise((resolve) => {
    console.log(11);
    resolve();
  }).then(() => {
    console.log(12);
  });
});
// 1 7 6 8 2 4 3 5 9 11 10 12

// 11之前

// // 1 7 6 8 2 4 9 11 3 10 5 12