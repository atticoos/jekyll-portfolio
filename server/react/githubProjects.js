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
      Star({className: 'stars'}, project.stargazers_count),
      div({className: 'content'},
        a({href: project.html_url, target: '_blank', title: project.html}, project.full_name),
        span(null, trimEmojis(project.description))
      )
    )
  );
}

function Star (options, count) {
  return (
    div(options,
      span({className: 'octicon octicon-star'}),
      span({className: 'count'}, count)
    )
  );
}

const trimEmojis = (text) => text.replace(/(:.*:)/i, '');
