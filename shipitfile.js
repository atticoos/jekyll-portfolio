var path = require('path');
var fetch = require('node-fetch');

module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  var deploymentId = null;

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
      deployTo: '/srv/www/portfolio/pull_requests'
    }
  });

  shipit.on('updated', function () {
    var builtDirectory = path.resolve('./public/');
    shipit.remoteCopy(builtDirectory, shipit.releasePath);
  });

  // notify github deployment has started
  shipit.on('deploy', function (callback) {
    var endpoint = [
      'repos',
      process.env.CIRCLE_PROJECT_USERNAME,
      process.env.CIRCLE_PROJECT_REPONAME,
      'deployments'
    ].join('/');
    var payload = {
      ref: process.env.CIRCLE_BRANCH,
      take: 'deploy',
      environment: 'staging',
      description: 'Deployment for ' + process.env.CIRCLE_BRANCH,
      production_environemnt: false,
      auto_merge: false
    };
    makeGithubRequest(endpoint, payload).then(function (deployment) {
      console.log('github deployment created', deployment);
      deploymentId = deployment.id;
    })
  });

  // notify github deployment has completed
  shipit.on('deployed', function (callback) {
    var endpoint = [
      'repos',
      process.env.CIRCLE_PROJECT_USERNAME,
      process.env.CIRCLE_PROJECT_REPONAME,
      'deployments',
      deploymentId,
      'statuses'
    ].join('/');
    var payload = {
      state: 'success',
      environment_url: 'http://pr' + process.env.CIRCLE_BUILD_NUM + '.provision.atticuswhite.com/'
    };
    makeGithubRequest(endpoint, payload);
  });
};

function makeGithubRequest(endpoint, body) {
  var url = 'https://api.github.com/' + endpoint + '?access_token=' + process.env.GITHUB_DEPLOYMENT_TOKEN;
  console.log('Making github request', url, body);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(function (response) {
    return response.json();
  });
}
