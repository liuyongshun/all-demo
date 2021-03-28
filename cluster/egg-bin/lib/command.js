'use strict';

const path = require('path');
const fs = require('fs');
const BaseCommand = require('./common-bin');

class Command extends BaseCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.parserOptions = {
      execArgv: true,
      removeAlias: true,
    };
    this.options = {
      typescript: {
        description: 'whether enable typescript support, will load `ts-node/register` etc',
        type: 'boolean',
        alias: 'ts',
        default: undefined,
      },

      declarations: {
        description: 'whether create dts, will load `egg-ts-helper/register`',
        type: 'boolean',
        alias: 'dts',
        default: undefined,
      },
    };
  }

  get context() {
    const context = super.context;
    const { argv, debugPort, execArgvObj, cwd, env } = context;

    // compatible
    if (debugPort) context.debug = debugPort;

    // remove unuse args
    argv.$0 = undefined;

    // read package.json
    let baseDir = argv.baseDir || cwd;
    if (!path.isAbsolute(baseDir)) baseDir = path.join(cwd, baseDir);
    const pkgFile = path.join(baseDir, 'package.json');
    const pkgInfo = fs.existsSync(pkgFile) ? require(pkgFile) : null;
    const eggInfo = pkgInfo && pkgInfo.egg;
    execArgvObj.require = execArgvObj.require || [];

    // read `egg.declarations` from package.json if not pass argv
    if (argv.declarations === undefined && eggInfo) {
      argv.declarations = eggInfo.declarations === true;
    }

    // read `egg.require` from package.json
    if (eggInfo && eggInfo.require && Array.isArray(eggInfo.require)) {
      execArgvObj.require = execArgvObj.require.concat(eggInfo.require);
    }

    return context;
  }
}

module.exports = Command;
