---
layout: post
title: Continuously deploying Jekyll with CircleCI and ShipIt
date: 2015-11-05 09:00:00
permalink: /blog/jekyll-circleci-shipit
tags: [jekyll, shipit]
excerpt: I moved things over to Jekyll. My next step was to start to introduce some deployment automation. Read about what I set up with CircleCI and Shipit for my continuous integration setup.
seo_title: Jekyll continuous integration with CircleCI and Shipit
seo_description: Continuously deploying Jekyll with CircleCI and Shipit for automated builds and releases
---

I recently ported my site from WordPress to Jekyll and couldn't be happier. I have a fantastic new portable toolset that feels more suitable and maintainable for myself as a developer. The only missing piece felt like automated deployments. I was still `ssh`ing into my server, pulling down my repo, and running my build tasks. This felt wrong compared to what we do at <a href="https://robinpowered.com">Robin Powered</a> with <a href="https://travis-ci.org/">Travis Continuous Integrations</a> and <a href="http://capistranorb.com/">Capistrano</a> to continuously release our applications in an automated way when we merge into `master`.

First, I didn't want to use Capistrano. I use it at work, and being a JS person and not a Ruby person, I didn't feel at home with it. It was something I could tweak if I needed to change parts of my deployment process, but to start from scratch I was ready to try something new and more familiar to me. Something where my question is "what would I like to do with this?", rather than "how can I do it with this?".

## F*ck it, ShipIt

This is when I discovered [Shipit](https://github.com/shipitjs/shipit). For the sake of this article, I'm going to assume you already know what Shipit is. If you don't, you can read <a href="#">my other post about how Shipit works</a>. As I'm using shipit for my deployments, I've incorporated the <a href="https://github.com/shipitjs/shipit-deploy">shipit-deploy</a> module, which facilitates the release process.

The next thing I need is a continuous integration build server. I use <a href="https://travis-ci.org/">TravisCI</a> at work, but the free plan doesn't allow for any private configurations. As I want to continuously deploy to my personal server, I need a place to hide environment variables or private SSH keys. This is when I turned to <a href="https://circleci.com/">CircleCI</a>. They allow their public containers to store private information, which was exactly what I needed. They also have a great interface with a grouped and collapsable regions representing different steps in your build:

<img src="/dist/images/blog/jekyll-continuous-delivery/circle.png" />

You can also find that exact build <a href="https://circleci.com/gh/ajwhite/jekyll-portfolio/59">here</a>.

I decided I want most of my building done on my CI server -- minimizing sources, building the static site, etc. If you think about it, there's not a compelling reason that I should duplicate this work on my server. The CI server already builds the project in production mode to verify and test everything; I'd rather take that build and _push_ it to my server instead.

This is what CircleCI will be doing:

- installing dependencies (bower, npm, gem)
- building sources (concatenating bower_component dependencies, concatenating site scripts)
- optimizing sources (minimizing sources, optimizing images)
- building the static site (`jekyll build`)
- test the build (validate links, etc)
- deploying the static build to my server


## Shipitfile

`shipit` will be taking care of the last step: deploying the static build to my server. Let's take a look at what <a href="#">shipitfile</a> looks like:

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
    var buildDirectory = path.resolve('./public/');
    shipit.remoteCopy(buildDirectory, shipit.releasePath);
  });
};
{% endhighlight %}


`shipit.initConfig` is pretty basic -- we define

- `workspace`: where inside the container (on the CI server) to prepare the release
- `repositoryUrl`: the project to use
- `ignore`: things to ignore when releasing
- `keepReleases`: how many historical releases to keep before removing older ones
- `deleteOnRollback`: if the release should be deleted when rolled back
- `shallowClone`: clone behavior of git, basically `--depth 1`

The important part of the `shipitfile` is the `on updated` listener:

{% highlight javascript %}
shipit.on('updated', function () {
  var buildDirectory = path.resolve('./public/');
  shipit.remoteCopy(buildDirectory, shipit.releasePath);
});
{% endhighlight %}

As mentioned previously, I don't want to run the entire build on my server. We've already built it on the CI server, and we're deploying a static site, so there's no migrations or other moving parts I need to take care of. I can just move my built project over to the production server.

`shipit.remoteCopy` will perform an `rsync` from the CI container to my production server. It takes the `/public` directory on the container, where the built static site is, and `rsync`s it to the release path created by `shipit-deploy`.

When this build completes, the generated static site has been uploaded to the release path, and `shipit-deploy` finishes up by rotating the latest release to be the `current`, and now my site is live.

## Displaying the build number on the site

To wrap things up, I thought it would be neat to see the build number on my site, along with the deployed commit `SHA`.

It's pretty simple, just a byline with a link to the Circle build. You can also just look in the footer of this blog and you'll see it.

<img src="/dist/images/blog/jekyll-continuous-delivery/build-number.png" />

CircleCI, like Travis and other CI integrations, <a href="https://circleci.com/docs/environment-variables">offers environment variables</a> that describe the build and the container. We'll be using

- `CIRCLE_SHA1` - The `SHA1` of the commit being tested
- `CIRCLE_BUILD_NUM` - The build number


This, as I found, had a couple of challenges in it. At first, I thought I could simply use <a href="http://jekyllrb.com/docs/configuration/#specifying-a-jekyll-environment-at-build-time">Jekyll environment</a>, but that's only to define a name for the environment, not accessing an object of environment variables. To do this, I had to add a plugin, <a href="https://github.com/ajwhite/jekyll-environment-variables">jekyll-environment-variables</a>, that would take environment variables and add them to the site:

{% highlight rb %}
module Jekyll
  class EnvironmentVariablesGenerator < Generator
    def generate(site)
      site.config['circle_sha'] = ENV['CIRCLE_SHA']
      site.config['circle_build_number'] = ENV['CIRCLE_BUILD_NUM']
    end
  end
end
{% endhighlight %}

## Putting it all together

After reading this, you should be able to set something similar up fairly quick. To summarize:

1. Run a build on CircleCI (or another CI server)
2. Configure `shipit` against a web server
3. Configure an `rsync` of your build directory containing the final static site to a directory on your web server
4. Merge that branch into `master`!
