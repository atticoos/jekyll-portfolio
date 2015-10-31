var path = require('path');

module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/jekyll-portfolio',
      deployTo: '/var/www/atticuswhite/jekyll-portfolio',
      repositoryUrl: 'https://github.com/ajwhite/jekyll-portfolio.git',
      ignore: ['.git'],
      keepReleases: 5,
      deleteOnRollback: false,
      shallowClone: true,
    },
    production: {
      servers: 'deploy@deploy.atticuswhite.com'
    }
  });

  shipit.on('updated', function () {
    var imageDirectory = path.resolve('./public/');
    shipit.remoteCopy(imageDirectory, shipit.releasePath);
  });
};
