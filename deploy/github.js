var fetch = require('node-fetch');
var util = require('./helper');

module.exports = function (shipit) {
  var deploymentId = null;

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
      environment: util.getDeploymentName() + '.provision.atticuswhite.com',
      description: 'Deployment for ' + process.env.CIRCLE_BRANCH,
      required_contexts: [],
      production_environemnt: false,
      auto_merge: false
    };
    makeGithubRequest(endpoint, payload).then(function (deployment) {
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
      environment_url: 'http://' + util.getDeploymentName() + '.provision.atticuswhite.com/'
    };
    makeGithubRequest(endpoint, payload);

    shipit.remote('echo "STARTING NPM"');
  });


  function makeGithubRequest(endpoint, body) {
    var url = 'https://api.github.com/' + endpoint + '?access_token=' + process.env.GITHUB_DEPLOYMENT_TOKEN;
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
};
