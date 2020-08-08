const esprima = require('esprima');
const code = 'var a = 3';
const word = esprima.tokenize(code);
console.log(word, 'lexicalllll');
