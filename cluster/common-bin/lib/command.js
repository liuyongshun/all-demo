'use strict';

const co = require('co');
const yargs = require('yargs');
const helper = require('./helper');
const fs = require('fs');
const path = require('path');

const DISPATCH = Symbol('Command#dispatch');
const PARSE = Symbol('Command#parse');
const COMMANDS = Symbol('Command#commands');

class CommonBin {
  constructor(rawArgv) {
    this.rawArgv = rawArgv || process.argv.slice(2);
    this.yargs = yargs(this.rawArgv);
    this.helper = helper;
    this.parserOptions = {
      execArgv: false,
      removeAlias: false,
      removeCamelCase: false,
    };
    // <commandName, Command>
    this[COMMANDS] = new Map();
  }

  load(fullPath) {
    const files = fs.readdirSync(fullPath);
    const names = [];
    for (const file of files) {
      if (path.extname(file) === '.js') {
        const name = path.basename(file).replace(/\.js$/, '');
        names.push(name);
        this.add(name, path.join(fullPath, file));
      }
    }
  }

  add(name, target) {
    if (!(target.prototype instanceof CommonBin)) {
      target = require(target);
      if (target && target.__esModule && target.default) {
        target = target.default;
      }
    }
    this[COMMANDS].set(name, target);
  }

  alias(alias, name) {
    this[COMMANDS].set(alias, this[COMMANDS].get(name));
  }

  start() {
    co(function* () {
      yield this[DISPATCH]();
    }.bind(this))
  }

  getSubCommandInstance(Clz, ...args) {
    return new Clz(...args);
  }

  * [DISPATCH]() {
    this.yargs
      .completion()
      .help()
      .version()
      .wrap(120)
      .alias('h', 'help')
      .group([ 'help', 'version' ], 'Global Options:');

    // get parsed argument without handling helper and version
    const parsed = yield this[PARSE](this.rawArgv);
    const commandName = parsed._[0];

    if (this[COMMANDS].has(commandName)) {
      const Command = this[COMMANDS].get(commandName);
      const rawArgv = this.rawArgv.slice();
      rawArgv.splice(rawArgv.indexOf(commandName), 1);

      const command = this.getSubCommandInstance(Command, rawArgv);
      yield command[DISPATCH]();
      return;
    }
    // for (const [ name, Command ] of this[COMMANDS].entries()) {
    //   this.yargs.command(name, Command.prototype.description || '');
    // }

    // const context = this.context;

    // yield this.helper.callFn(() => {}, [ context ], this);
  }

  get context() {
    const argv = this.yargs.argv;
    const context = {
      argv,
      cwd: process.cwd(),
      env: Object.assign({}, process.env),
      rawArgv: this.rawArgv,
    };
    // extract execArgv
    if (this.parserOptions.execArgv) {
      // extract from command argv
      let { execArgvObj } = this.helper.extractExecArgv(argv);

      // exports execArgv
      const self = this;
      context.execArgvObj = execArgvObj;

      Object.defineProperty(context, 'execArgv', {
        get() {
          const lazyExecArgvObj = context.execArgvObj;
          const execArgv = self.helper.unparseArgv(lazyExecArgvObj, { excludes: [ 'require' ] });
          // convert require to execArgv
          let requireArgv = lazyExecArgvObj.require;
          if (requireArgv) {
            if (!Array.isArray(requireArgv)) requireArgv = [ requireArgv ];
            requireArgv.forEach(item => {
              execArgv.push('--require');
              execArgv.push(item.startsWith('./') || item.startsWith('.\\') ? path.resolve(context.cwd, item) : item);
            });
          }
          return execArgv;
        },
      });
    }

    return context;
  }

  [PARSE](rawArgv) {
    return new Promise((resolve, reject) => {
      this.yargs.parse(rawArgv, (err, argv) => {
        if (err) return reject(err);
        resolve(argv);
      });
    });
  }
}

module.exports = CommonBin;
