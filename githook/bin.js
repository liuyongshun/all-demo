#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const init = require("./init");
console.dir()
function readPkg() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, './package.json'), 'utf-8'));
}
const pkg = readPkg();
const [, , cmd, ...args] = process.argv;

switch (cmd) {
    case 'init': {
        const isYarn2 = String(process.env.npm_config_user_agent).startsWith('yarn/2');
        init.init(isYarn2);
        break;
    }
    case 'install': {
        if (args.length > 2) {
            help();
            process.exit(2);
        }
        init.install(args[0]);
        break;
    }
    case 'uninstall': {
        init.uninstall();
        break;
    }
    case 'set': {
        if (args.length === 0 || args.length > 2) {
            help();
            process.exit(2);
        }
        init.set(args[0], args[1]);
        break;
    }
    case 'add': {
        if (args.length === 0 || args.length > 2) {
            help();
            process.exit(2);
        }
        init.add(args[0], args[1]);
        break;
    }
    default:
        help();
}
