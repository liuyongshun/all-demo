const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

function init() {
    install();
    set('.sp-doc-tree/pre-commit', 'npm test');
}
//
function install(dir = '.sp-doc-tree') {
    fs.mkdirSync(path.join(dir, '_'), { recursive: true });
    fs.writeFileSync(path.join(dir, '.gitignore'), '_\n', 'utf-8');
    fs.copyFileSync(path.join(__dirname, '../../scripts/sp-doc-tree.sh'), path.join(dir, '_/sp-doc-tree.sh'));
}
// 添加
function data(cmd) {
    return `#!/bin/sh
. "$(dirname "$0")/_/sp-doc-tree.sh"

${cmd}
`;
}

function set(file, cmd) {
    fs.writeFileSync(file, data(cmd), { mode: 0o0755 });
}

function add(file, cmd) {
    if (fs.existsSync(file)) {
        fs.appendFileSync(file, `${cmd}\n`);
    }
    else {
        set(file, cmd);
    }
}

// 卸载
function uninstall() {
    childProcess.spawnSync('git', ['config', '--unset', 'core.hooksPath'], {
        stdio: 'inherit',
    });
}

module.exports = {
    init,
    install,
    add,
    uninstall
}
