var util = require('./deploy/helper');
var staticDeployment = require('./deploy/static');
var githubDeployment = require('./deploy/github');
var serverDeployment = require('./deploy/server');

module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/jekyll-portfolio',
      repositoryUrl: 'https://github.com/ajwhite/jekyll-portfolio.git',
      ignore: ['.git'],
      keepReleases: 5,
      deleteOnRollback: false,
      shallowClone: false,
    },
    production: {
      servers: 'deploy@deploy.atticuswhite.com',
      deployTo: '/var/www/atticuswhite/jekyll-portfolio'
    },
    develop: {
      servers: 'deploy@deploy.atticuswhite.com',
      deployTo: '/var/www/atticuswhite/dev.jekyll-portfolio'
    },
    pull_request: {
      servers: 'deploy@provision.atticuswhite.com',
      deployTo: '/srv/www/portfolio/ci-builds/' + util.getDeploymentName()
    }
  });

  staticDeployment(shipit);
  githubDeployment(shipit);
  serverDeployment(shipit);
};
