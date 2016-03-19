'use strict';

import fetch from 'node-fetch';

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

function resolveResponse (response) {
  return events => response.json(200, events);
}

function rejectResponse (response) {
  return error => response.status(400).json(error);
}

export function githubActivityHandler (user) {
  return (request, response) => {
    recursivelyFetchRelevantActivity(user, 10, 'IssueEvent', 'PushEvent')
      .then(resolveResponse(response))
      .catch(rejectResponse(response));
  };
}
