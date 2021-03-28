'use strict';
const cp = require('child_process');
const is = require('is-type-of');
const unparse = require('dargs');

const childs = new Set();
let hadHook = false;
function gracefull(proc) {
  // save child ref
  childs.add(proc);

  // only hook once
  /* istanbul ignore else */
  if (!hadHook) {
    hadHook = true;
    let signal;
    [ 'SIGINT', 'SIGQUIT', 'SIGTERM' ].forEach(event => {
      process.once(event, () => {
        signal = event;
        process.exit(0);
      });
    });

    process.once('exit', () => {
      for (const child of childs) {
        child.kill(signal);
      }
    });
  }
}

exports.forkNode = (modulePath, args = [], options = {}) => {
  options.stdio = options.stdio || 'inherit';
  const proc = cp.fork(modulePath, args, options);
  gracefull(proc);

  const promise = new Promise((resolve, reject) => {
    proc.once('exit', code => {
      childs.delete(proc);
      if (code !== 0) {
        const err = new Error(modulePath + ' ' + args + ' exit with code ' + code);
        err.code = code;
        reject(err);
      } else {
        resolve();
      }
    });
  });

  promise.proc = proc;

  return promise;
};

exports.spawn = (cmd, args = [], options = {}) => {
  options.stdio = options.stdio || 'inherit';

  return new Promise((resolve, reject) => {
    const proc = cp.spawn(cmd, args, options);
    gracefull(proc);
    proc.once('error', err => {
      /* istanbul ignore next */
      reject(err);
    });
    proc.once('exit', code => {
      childs.delete(proc);

      if (code !== 0) {
        return reject(new Error(`spawn ${cmd} ${args.join(' ')} fail, exit code: ${code}`));
      }
      resolve();
    });
  });
};

exports.npmInstall = (npmCli, name, cwd) => {
  const options = {
    stdio: 'inherit',
    env: process.env,
    cwd,
  };

  const args = [ 'i', name ];
  console.log('[common-bin] `%s %s` to %s ...', npmCli, args.join(' '), options.cwd);

  return exports.spawn(npmCli, args, options);
};

exports.callFn = function* (fn, args = [], thisArg) {
  if (!is.function(fn)) return;
  if (is.generatorFunction(fn)) {
    return yield fn.apply(thisArg, args);
  }
  const r = fn.apply(thisArg, args);
  if (is.promise(r)) {
    return yield r;
  }
  return r;
};

exports.unparseArgv = (argv, options = {}) => {
  return [ ...new Set(unparse(argv, options)) ];
};

exports.extractExecArgv = argv => {
  const debugOptions = {};
  const execArgvObj = {};
  let debugPort;

  for (const key of Object.keys(argv)) {
    const value = argv[key];
    // skip undefined set uppon (camel etc.)
    if (value === undefined) continue;
    if ([ 'debug', 'debug-brk', 'debug-port', 'inspect', 'inspect-brk', 'inspect-port' ].includes(key)) {
      if (typeof value === 'number') debugPort = value;
      debugOptions[key] = argv[key];
      execArgvObj[key] = argv[key];
    } else if (match(key, [ 'es_staging', 'expose_debug_as', /^harmony.*/ ])) {
      execArgvObj[key] = argv[key];
    } else if (key.startsWith('node-options--')) {
      // support node options, like: commond --node-options--trace-warnings => execArgv.push('--trace-warnings')
      execArgvObj[key.replace('node-options--', '')] = argv[key];
    }
  }
  return { debugPort, debugOptions, execArgvObj };
};

function match(key, arr) {
  return arr.some(x => x instanceof RegExp ? x.test(key) : x === key); // eslint-disable-line no-confusing-arrow
}
