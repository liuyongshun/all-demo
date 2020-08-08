
// 事实上 babel 语法转化, 也是基于 ast 处理的, 我们可以直接使用 babel 写好的功能, 实现箭头函数转化
const babel = require('@babel/core');
const code = `const fn = () => 3`;
// babel 有 transform 方法会帮我们自动遍历，使用相应的预设或者插件转换相应的代码
const newCode = babel.transform(code, {
  plugins: ['@babel/plugin-transform-arrow-functions'],
})
console.log(newCode.code)
