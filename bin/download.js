const which = require('which');

function install({command, success, cwd, params}) {
  params = params || [];
  const _install = require('child_process').spawn(command, params, {
    // keep color
    cwd,
    stdio: 'inherit',
  });
  _install.on('close', function(code) {
    success && success(code);
  });
}

function findNpmOrYarn() {
  const npmOrYarn = process.platform === 'win32'
    ? ['yarn.cmd', 'cnpm.cmd', 'npm.cmd']
    : ['yarn', 'cnpm', 'npm'];
  for (var i = 0; i < npmOrYarn.length; i++) {
    try {
      which.sync(npmOrYarn[i]);
      console.log('use npmOrYarn: ' + npmOrYarn[i]);
      return npmOrYarn[i];
    } catch (e) {}
  }
  throw new Error('please install npm');
}

module.exports = function download({success, cwd}) {
  const npmOrYarn = findNpmOrYarn();
  install({
    command: which.sync(npmOrYarn),
    params: ['install'],
    success,
    cwd,
  });
};