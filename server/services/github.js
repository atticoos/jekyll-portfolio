'use strict';

import fetch from 'node-fetch';
import * as Redis from './redis';

const BASE_URL = 'https://api.github.com';

export function getActivity (user, totalEvents, ...relevantActivity) {
  var cacheKey = `github/${user}/activity`;
  return Redis.getJSON(cacheKey)
    .catch(() => {
      return recursivelyFetchRelevantActivity(user, totalEvents, ...relevantActivity).then(results => {
        Redis.setJSON(cacheKey, results, {expire: 60 * 30});
        return results
      });
    });
}

export function getProjects (user, totalProjects) {
  var cacheKey = `github/${user}/repos`;
  return Redis.getJSON(cacheKey)
    .catch(() => {
      return recursivelyFetchRepos(user, totalProjects).then(results => {
        Redis.setJSON(cacheKey, results, {expire: 60 * 30});
        return results;
      });
    });
}


function recursivelyFetchRelevantActivity(user, totalEvents, ...relevantActivity) {
  const MAX_PAGES = 10;
  var filter = filterRelevantActivity(...relevantActivity);

  const request = (page = 1, events = []) => {
    return getRemoteActivity(user, page)
      .then(filter)
      .then(filteredEvents => {
        var combined = events.concat(filteredEvents);
        if (combined.length < totalEvents && page < MAX_PAGES) {
          return request(page + 1, combined);
        }
        return combined.slice(0, totalEvents);
      });
  }

  return request();
}

function recursivelyFetchRepos(user, totalRepos) {
  const PER_PAGE = 100;
  const request = (page = 1, combinedRepos = []) => {
    return getRemoteRepos(user, page)
      .then(repos => {
        combinedRepos = combinedRepos.concat(repos);
        if (repos.length === PER_PAGE && page < 5) {
          return request(page + 1, combinedRepos, PER_PAGE);
        }
        return combinedRepos.sort(sortByStargazers);
      });
  }
  return request().then(projects => projects.slice(0, totalRepos));
}

function getRemoteRepos (user, page = 1, perPage = 100) {
  return fetch (`${BASE_URL}/users/${user}/repos?page=${page}&per_page=${perPage}`)
    .then(toJson);
}

function getRemoteActivity (user, page = 1) {
  return fetch(`${BASE_URL}/users/${user}/events?page=${page}`)
    .then(toJson);
}

function toJson(response) {
  return response.json().then((json) => {
    if (response.status >= 400) {
      throw new Error(`Failed to fetch with error ${response.status}`);
    }
    return json;
  });
}

function filterRelevantActivity(...eventTypes) {
  return events => events.filter(event => eventTypes.indexOf(event.type) > -1);
}


function sortByStargazers (a, b) {
  return b.stargazers_count - a.stargazers_count;
}
