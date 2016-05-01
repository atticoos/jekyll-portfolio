module.exports = function (shipit) {
  shipit.on('updated', function () {
    console.log('Running npm install');
    shipit.remote('echo "RUNNING NPM INSTALL"');
    return shipit.remote('cd ' + shipit.releasePath + ' && npm install --verbose');
    return shipit.remote('npm install', {cwd: shipit.releasePath});
  });
}
