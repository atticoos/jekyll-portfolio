'use strict';

import fetch from 'node-fetch';
import {getActivity, getProjects} from './services/github';
import ReactDOMServer from 'react-dom/server';
import GithubActivityFeed from './react/githubActivity';
import GithubProjects from './react/githubProjects';

function resolveActivityResponse (response) {
  return events => response.end(
    ReactDOMServer.renderToString(GithubActivityFeed({events}))
  );
}

function resolveProjectsResponse (response) {
  return projects => response.end(
    ReactDOMServer.renderToString(GithubProjects({projects}))
  );
}

function rejectResponse (response) {
  return error => {
    console.log('an error', error);
    response.json(400, error);
  }
}

export function githubActivityHandler (user, count = 12) {
  return (request, response) => {
    response.setHeader('Content-Type', 'text/html');
    getActivity(user, 20, 'PullRequestEvent', 'PushEvent')
      .then(items => items.slice(0, count))
      .then(resolveActivityResponse(response))
      .catch(rejectResponse(response));
  };
}

export function githubProjectHandler (user) {
  return (request, response) => {
    response.setHeader('Content-Type', 'text/html');
    getProjects(user, 10)
      .then(resolveProjectsResponse(response))
      .catch(rejectResponse(response));
  }
}
