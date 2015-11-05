---
layout: post
title: Continuously deploying Jekyll with CircleCI and ShipIt
date: 2015-11-05 08:00:00
permalink: /blog/jekyll-circleci-shipit
tags: [jekyll, shipit]
excerpt: Continuously deploying your Jekyll sites with ShipIt
seo_title: Jekyll continuous integration with CircleCI and ShipIt
seo_description: Continuously deploying your Jekyll sites with CircleCI and ShipIT
---

I recently ported my site from WordPress to Jekyll and couldn't be happier. I have a fantastic new portable toolset that feels more suitable and maintainable for myself as a developer. The only missing piece felt like automated deployments. I was still `ssh`ing into my server, pulling down my repo, and running my build tasks. This felt wrong compared to what we do at <a href="https://robinpowered.com">Robin Powered</a> with <a href="https://travis-ci.org/">Travis Continuous Integrations</a> and <a href="http://capistranorb.com/">Capistrano</a> to continuously release our applications in an automated way when we merge into `master`.

First, I didn't want to use Capistrano. I use it at work, and being a JS person and not a Ruby person, I didn't feel at home with it. It was something I could tweak if I needed to change my deployment process, but to start from scratch I was ready to try something new and more familiar to me. Something where my question is "what would I like to do with this?", rather than "how can I do it with this?".

## F*ck it, ShipIt

This is when I discovered [Shipit](https://github.com/shipitjs/shipit). For the sake of this article, I'm going to assume you already know what Shipit is. If you don't, you can read <a href="#">my other post about how Shipit works</a>. As I'm using shipit for my deployments, I've incorporated the <a href="https://github.com/shipitjs/shipit-deploy">shipit-deploy</a> module, which facilitates the release process.

The next thing I need is a continuous integration build server. I use <a href="https://travis-ci.org/">TravisCI</a> at work, but the free plan doesn't allow for any private configurations. As I want to continuously deploy to my personal server, I need a place to hide environment variables or private SSH keys. This is when I turned to <a href="https://circleci.com/">CircleCI</a>. They allow their public containers to store private information, which was exactly what I needed. They also have a great interface with a grouped and collapsable regions representing different steps in your build:

<img src="/dist/images/blog/jekyll-continuous-delivery/circle.png" />

You can also find that exact build <a href="https://circleci.com/gh/ajwhite/jekyll-portfolio/59">here</a>.

I decided I want most of my building done on my CI server -- minimizing sources, building the static site, etc. If you think about it, there's not a compelling reason that I should duplicate this work on my server. The CI server already builds the project to verify and test everything; I'd rather take that build and _push_ it to my server instead.

This is what CircleCI will be doing:

- installing dependencies (bower, npm, bundler)
- building sources (concatenating bower_component dependencies, concatenating site scripts)
- optimizing sources (minimizing sources, optimizing images)
- building the static site (`jekyll build`)
- test the build (validate links, etc)
- deploying the static build to my server


## Shipitfile




<a href="#">My shipitfile</a> looks like this:

{% highlight javascript %}
var path = require('path');

module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/jekyll-portfolio',
      repositoryUrl: 'https://github.com/ajwhite/jekyll-portfolio.git',
      ignore: ['.git', 'node_modules'],
      keepReleases: 5,
      deleteOnRollback: false,
      shallowClone: true,
    },
    production: {
      servers: 'deploy@deploy.atticuswhite.com',
      deployTo: '/var/www/atticuswhite/jekyll-portfolio'
    },
    develop: {
      servers: 'deploy@deploy.atticuswhite.com',
      deployTo: '/var/www/atticuswhite/dev.jekyll-portfolio'
    }
  });

  shipit.on('updated', function () {
    var imageDirectory = path.resolve('./public/');
    shipit.remoteCopy(imageDirectory, shipit.releasePath);
  });
};
{% endhighlight %}
