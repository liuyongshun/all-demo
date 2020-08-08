const esprima = require('esprima');
const code = 'var a = 3';
const word = esprima.parse(code);
console.log(word, 'syntaxxxxxxxxxx');
