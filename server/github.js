'use strict';

import fetch from 'node-fetch';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import GithubActivityFeed from './react/githubActivity';
import GithubProjects from './react/githubProjects';

const BASE_URL = 'https://api.github.com';

function toJson(response) {
  return response.json().then((json) => {
    if (response.status >= 400) {
      throw new Error(`Failed to fetch with error ${response.status}`);
    }
    return json;
  });
}

function getActivity (user, page = 1) {
  return fetch(`${BASE_URL}/users/${user}/events?page=${page}`)
    .then(toJson);
}

function filterRelevantActivity(...eventTypes) {
  return events => events.filter(event => eventTypes.indexOf(event.type) > -1);
}

function recursivelyFetchRelevantActivity(user, totalEvents, ...relevantActivity) {
  const MAX_PAGES = 10;
  var filter = filterRelevantActivity(...relevantActivity);

  const request = (page = 1, events = []) => {
    return getActivity(user, page)
      .then(filter)
      .then(filteredEvents => {
        var combined = events.concat(filteredEvents);
        if (combined.length < totalEvents) {
          return request(page + 1, combined);
        }
        return combined.slice(0, totalEvents);
      });
  }

  return request();
}

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
    response.json(200, error);
  }
}


function getMock () {
  return new Promise((resolve, reject) => {
    var mock = fs.readFileSync('./MOCK.json')
    var filter = filterRelevantActivity('PushEvent', 'PullRequestEvent');
    var events = filter(JSON.parse(mock));
    resolve(events);
  });
}

function getMockProjects () {
  return new Promise((resolve, reject) => {
    var mock = fs.readFileSync('./MOCK_PROJECTS.json')
    var projects = JSON.parse(mock);
    var topProjects = projects.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10);
    resolve(topProjects);
  });
}

export function githubActivityHandler (user) {
  return (request, response) => {
    response.setHeader('Content-Type', 'text/html');
    // recursivelyFetchRelevantActivity(user, 20, 'PullRequestEvent', 'PushEvent')
    getMock()
      .then(resolveActivityResponse(response))
      .catch(rejectResponse(response));
  };
}

export function githubProjectHandler (user) {
  return (request, response) => {
    response.setHeader('Content-Type', 'text/html');
    getMockProjects()
      .then(resolveProjectsResponse(response))
      .catch(rejectResponse(response));
  }
}
