const babel = require('@babel/core');
const type = require('@babel/types');
const code = `const fn = () => {return 3}`;

const arrowFnPlugin = {
  visitor: {
    ArrowFunctionExpression(path) {
      const node = path.node;
      const params = node.params;
      const body = node.body;
      // babel type 的方法
      // https://babeljs.io/docs/en/babel-types#bindexpression
      if (!type.isBlockStatement(body)) {
        body = type.blockStatement([body]);
      }
      const functionExpression = type.functionExpression(null, params, body);
      // babel plugin
      // https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-writing-your-first-babel-plugin
      path.replaceWith(functionExpression);
    },
  },
};

const newArrow = babel.transform(code, {
  plugins: [arrowFnPlugin]
});

console.log(newArrow.code);
