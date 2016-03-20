'use strict';

import React, {DOM} from 'react';
const {
  div,
  span,
  a
} = DOM;

export default function GithubProjects ({projects}) {
  return (
    div({
      children: projects.map(project => GithubProject(project))
    })
  )
}

function GithubProject (project) {
  return (
    div({className: `project`},
      Stats({className: 'stats'}, {stars: project.stargazers_count, forks: project.forks_count}),
      div({className: 'content'},
        a({href: project.html_url, target: '_blank', title: project.html_url}, project.full_name),
        span(null, trimEmojis(project.description))
      )
    )
  );
}

function Stats (options, {stars, forks}) {
  return (
    div(options,
      div({className: 'stars'},
        span({className: 'octicon octicon-star'}),
        span({className: 'count'}, stars)
      ),
      div({className: 'forks'},
        span({className: 'octicon octicon-repo-forked'}),
        span({className: 'count'}, forks)
      )
    )
  );
}

const trimEmojis = (text) => text.replace(/(:.*:)/i, '');
