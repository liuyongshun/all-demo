
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const code = `const fn = () => 3`;
// 生成 AST
const ast = esprima.parseScript(code);
// 转换 AST，只会遍历有 type 的属性, traverse 方法中有进入和离开两个钩子函数
estraverse.traverse(ast, {
  // 进入节点的钩子函数
  enter(node) {
    if (node.type === 'ArrowFunctionExpression') {
      node.type = 'FunctionExpression';
      let param = {};
      if (node.body.type === 'BlockStatement') {
        param = { type: 'BlockStatement', body: node.body.body };
      } else {
        param = { type: 'BlockStatement', body: [{
          type: 'ReturnStatement',
          argument: node.body
        }]};
      }
      node.body = param;
      node.expression = false;
    }
    console.info(`entry ===== ${node.type}`);
  },
  // 离开节点的钩子函数
  leave(node) {
    console.info(`leave ===== ${node.type}`);
  },
})

// 处理完之后的语法树结构, 从新生成代码
const newFun = escodegen.generate(ast);
console.info(newFun);
