'use strict';

import fetch from 'node-fetch';
import Promise from 'bluebird';
import * as Redis from './redis';

const BASE_URL = 'https://api.github.com';
const CACHE_TTL = 60 * 30; // 30 minutes

export function getActivity (user, totalEvents, relevantActivity, ignoredRepos) {
  var cacheKey = `github/${user}/activity`;
  return Redis.getJSON(cacheKey)
    .catch(() => {
      return recursivelyFetchRelevantActivity(user, totalEvents, relevantActivity, ignoredRepos).then(results => {
        Redis.setJSON(cacheKey, results, CACHE_TTL);
        return results
      });
    });
}

export function getProjects (user, totalProjects) {
  var cacheKey = `github/${user}/repos`;
  return Redis.getJSON(cacheKey)
    .catch(() => {
      return recursivelyFetchRepos(user).then(results => {
        Redis.setJSON(cacheKey, results, CACHE_TTL);
        return results;
      });
    }).then(projects => projects.slice(0, totalProjects));
}

export function getProfile (user) {
  var cacheKey = `github/${user}`;
  return Redis.getJSON(cacheKey)
    .catch(() => {
      return fetchProfile(user).then(profile => {
        Redis.setJSON(cacheKey, profile, CACHE_TTL);
        return profile;
      });
    });
}

export function getStats (user) {
  return Promise.all([
    getProfile(user),
    getProjects(user)
  ]).spread(({followers, public_repos}, projects) => {
    var stars = projects.reduce((stars, project) => stars + project.stargazers_count, 0);
    return {
      stars,
      followers,
      repos: public_repos
    }
  });
}

export function getTotalStars (user) {
  return getProjects(user).then(projects => {
    return projects.reduce((stars, projects) => stars + project.stargazers_count, 0);
  });
}


function recursivelyFetchRelevantActivity(user, totalEvents, relevantActivity, ignoredRepos) {
  const MAX_PAGES = 10;
  var filter = filterRelevantActivity(relevantActivity, ignoredRepos);

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
  return request(); //.then(projects => projects.slice(0, totalRepos));
}

function fetchProfile (user) {
  return fetch(`${BASE_URL}/users/${user}`)
    .then(toJson);
}

function getRemoteRepos (user, page = 1, perPage = 100) {
  return fetch(`${BASE_URL}/users/${user}/repos?page=${page}&per_page=${perPage}`)
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

function filterRelevantActivity (eventTypes = [], ignoredRepos = []) {
  return events => events.filter(event => {
    return eventTypes.indexOf(event.type) > -1 &&
      ignoredRepos.indexOf(event.repo.name) === -1;
  });
}


function sortByStargazers (a, b) {
  return b.stargazers_count - a.stargazers_count;
}
