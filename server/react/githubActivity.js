'use strict';

import React, {DOM} from 'react';
const {
  div,
  span,
  a
} = DOM;

export default function GithubActivityFeed (props) {
  return (
    div({
      children: props.events.map(event => {
        switch(event.type) {
          case 'PushEvent':
            return PushEventActivity(event);
          case 'PullRequestEvent':
            return PullRequestEventActivity(event);
          default:
            return null;
        }
      })
    })
  )
}

function PushEventActivity ({repo, payload}) {
  return (
    div(null,
      'I recently pushed ',
      a({
        href: commitsToUrl(repoLink(repo.name), payload),
        target: '_blank'
      }, `${payload.commits.length} commits `),
      'to ',
      a({
        href: repoLink(repo.name),
        target: '_blank'
      }, repo.name)
    )
  );
}

function PullRequestEventActivity ({repo, payload}) {
  return (
    div(null,
      `I recently ${payload.action} a `,
      a({
        href: pullRequestUrl(repoLink(repo.name), payload.number)
      }, 'pull request '),
      'on ',
      a({
        href: repoLink(repo.name),
        target: '_blank'
      }, repo.name)
    )
  );
}


const repoLink = name => `https://github.com/${name}`;
const commitUrl = (repoUrl, sha) => `${repoUrl}/commits/${sha}`;
const commitRangeUrl = (repoUrl, tail, head) => `${repoUrl}/compare/${tail}...${head}`;
const pullRequestUrl = (repoUrl, number) => `${repoUrl}/pull/${number}`;

const commitsToUrl = (repoUrl, {commits, before, head}) => {
  if (commits.length === 1) {
    return commitUrl(repoUrl, commits[0].sha);
  }
  return commitRangeUrl(repoUrl, before, head);
}
