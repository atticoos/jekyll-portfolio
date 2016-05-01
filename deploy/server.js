module.exports = function (shipit) {
  shipit.on('updated', function () {
    console.log('Running npm install');
    shipit.remote('echo "RUNNING NPM INSTALL"');
    return shipit.remote('cd ' + shipit.releasePath + ' && npm install').then(function () {
      var commands = [
        'cd ' + shipit.releasePath,
        'pm2 stop ' + process.env.CIRCLE_BRANCH,
        'NODE_PORT=' + (parseInt(process.env.CIRCLE_BUILD_NUM) * 20000) + ' pm2 start server/ --name ' + process.env.CIRCLE_BRANCH
      ].join('&&');
      return shipit.remote(commands);
    });
  });
}
