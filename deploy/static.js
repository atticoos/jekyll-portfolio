var path = require('path');

module.exports = function (shipit) {
  shipit.on('updated', function () {
    var builtDirectory = path.resolve('./public');
    shipit.remoteCopy(builtDirectory, shipit.releasePath);
  });
}
