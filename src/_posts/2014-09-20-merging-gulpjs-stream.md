---
layout: post
title: Merging multiple GulpJS streams into one output file
date: 2014-09-20 00:25:00
permalink: /blog/merging-gulpjs-streams
tags: [gulpjs]
excerpt: Learn how to take multiple GulpJS build tasks and merge them into one output stream by combining streams with NodeJS' EventStream
seo_title: Merging multiple GulpJS streams into one - Javascript
disqus_id: '349 http://www.atticuswhite.com/?p=349'
---

Sometimes when you're building out your GulpJS tasks, you need to create a stream against two different groups of files. In some of these cases, they should both end up in the same place. However, one group of files undergoes one build process, and other undergoes a separate build process.

Let's take a look at an angular example using GulpJS for the following two build processes:

1. Concatenating all of our Javascript files into one (<a href="https://www.npmjs.org/package/gulp-concat" title="gulp-concat on npm" target="_blank">gulp-concat</a>)
2. Transforming our HTML views into Javascript strings for $templateCache (html2js, or in this example <a title="gulp-angular-templatecache" href="https://www.npmjs.org/package/gulp-angular-templatecache" target="_blank">gulp-angular-templatechace</a>)

So we define the following two build tasks:

{% highlight javascript %}
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    templateCache = require('gulp-angular-templatecache');

gulp.task('compile', function () {
  gulp.src('src/scripts/**/*.js')
  .pipe(concat('main.js'))
  .dest('dist/');
});

gulp.task('html2js', function () {
  gulp.src('src/views/**/*.html')
  .pipe(templateCache({
      filename: 'main.tpls.js'
  }))
  .dest('dist/');
});

gulp.task('build', ['compile', 'html2js']);
{% endhighlight %}

We can run each one, but they will produce two separate files -- `dist/main.js` and `dist/main.tpls.js`, where instead we'd prefer one. We could concatenate these files together, or have our concat task require the templateCache task and include that as the stream source, but neither of those are as clean as they could be. So what about creating two streams instead of two separate tasks? We could instead create these two streams and merge them together via <a title="event-stream" href="https://www.npmjs.org/package/event-stream" target="_blank">event-stream</a>: 

1. Initialize a stream of our Javascript files
2. Initialize a stream for our HTML files
3. Compile our HTML into JS
4. Merge the two stream with `event-stream`
5. Pipe into `gulp-concat`
6. And then finally pipe to our destination

{% highlight javascript %}
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    templateCache = require('gulp-angular-templatecache'),
    eventStream = require('event-stream');

gulp.task('build', function () {
  var javascriptStream = gulp.src('src/**/*.js'),
      htmlStream = gulp.src('src/**/*.html');
  htmlStream.pipe(templateCache());
  eventStream.merge(javascriptStream, htmlStream)
  .pipe(concat('main.js'))
  .pipe(gulp.dest('dist'));
});
{% endhighlight %}

Now we can take two different stream sources, process them through specific tasks, and have them result in the same output.
