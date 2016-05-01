module.exports = function (shipit) {
  shipit.on('deploy', function () {
    shipit.remote('npm install');
  });
}
