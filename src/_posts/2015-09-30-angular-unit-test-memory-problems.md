---
layout: post
title: Memory problems when testing large AngularJS applications
date: 2015-09-30 23:21:00
permalink: /blog/angular-unit-test-memory-problems
tags: [angularjs]
excerpt: Memory can become a problem for unit testing large AngularJS problems. Whether you're running Karma with PhantomJS, Chrome, Firefox - we will all share the issue of these browsers pushing the limits of the available memory.
seo_title: Unit test memory leaks with AngularJS, Karma, and PhantomJS
seo_description: Unit testing large AngularJS projects can eventually lead to excess memory consumed by PhantomJS, Chrome, or Firefox running Karma. This can be fixed.
disqus_id: '596 http://atticuswhite.com/?post_type=post&#038;p=596'
---

Depending on your project, you may reach a point where running your tests consumes an extraordinary amount of memory, or you're heading that way. If you're not sure, take a look at how much memory your test runs consume, you may be surprised. This usually kicks in when you're hitting around 1,000 tests and have a sizable number of controllers, services, and directives. Our test environment is comprised of <a href="http://karma-runner.github.io/0.13/index.html" title="Karma - Spectacular Test Runner" target="_blank">Karma</a>, <a href="https://mochajs.org/" title="Mocha - the fun, simple, flexible Javascript test framework" target="_blank">Mocha</a>, <a href="http://sinonjs.org/" title="Sinon.JS" target="_blank">Sinon-Chai</a>, <a href="https://docs.angularjs.org/api/ngMock" title="AngularJS API ngMock" target="_blank">Angular Mocks</a>, and <a href="http://phantomjs.org/" title="PhantomJS" target="_blank">PhantomJS</a>. This problem recently kicked in for us and were were locked out from passing builds on Travis for the day.

<img src="/dist/images/blog/angular-unit-test-memory-problems/travis-output.png" alt="PhantomJS crash" />

We learned that by the end of our tests, PhantomJS's memory footprint was exceeding <strong>2GB</strong>. Ready to pin the problem on PhantomJS, we tried running our tests in FireFox and Chrome, as there had been some mentions of pre 2.0 PhantomJS leaking memory - <a href="https://github.com/angular/material/issues/4734" target="_blank">angular/material#4734</a>, <a href="https://github.com/ariya/phantomjs/issues/12317#issuecomment-64858471" target="_blank">ariya/phantomjs#12317</a>, as a couple examples. The same results were apparent in all environments.
<img src="http://atticuswhite.com/wordpress/../wp-content/uploads/2015/09/d5a93ee2-679d-11e5-9041-83c8dec198fb.png" alt="Chrome memory consumption" />
I was eager to blame this problem on a memory leak, either in my code or with Karma itself, but having to deal with this problem I had the chance to learn a little bit more about the internals of Angular and Angular Mocks.

## Profiling

After restarting Travis five times, I began monitoring the memory usage after each unit. I omitted all my unit tests except for a set of units used profile and observe any patterns. The test is set up as the following:

- Load the angular module before each test
- Call `inject()` without any services (maybe those were the problem and not getting recycled)
- Run a ton of basic units, and throw in a timeout so there is time to evaluate each step

{% highlight javascript %}
'use strict';
describe('memory test', function () {
  beforeEach(module('app'));
  beforeEach(inject());
  describe('testing', function () {
    it ('should grow in memory', function (done) {
      setTimeout(function () {
        for (var i = 1; i < 100; i++) {
          var result = Math.pow(i, 2);
          expect(result).to.be.eql(Math.pow(i, 2));
        }
        done();
      }, 500);
    });
    // repeat the above unit 500 times
  });
});
{% endhighlight %}

I watched every unit tick by with more and more memory being consumed even without my tests doing anything exceptional, and without executing any application code or injecting any services that may be leaking:

<img src="/dist/images/blog/angular-unit-test-memory-problems/profile-1.gif" alt="Memory usage round 1" />

My next move was to remove `beforeEach(module('name'))` and see if this changes my memory footprint. It didn't really.

{% highlight javascript %}
'use strict';
describe('memory test', function () {
  // beforeEach(module('app'));
  beforeEach(inject());
  describe('testing', function () {
    it ('should grow in memory', function (done) {
      setTimeout(function () {
        for (var i = 1; i < 100; i++) {
          var result = Math.pow(i, 2);
          expect(result).to.be.eql(Math.pow(i, 2));
        }
        done();
      }, 500);
    });
    // repeat 500 times
  });
});
{% endhighlight %}

<img src="/dist/images/blog/angular-unit-test-memory-problems/profile-2.gif" alt="Memory usage round 2" />

As nothing changed, my last attempt was to remove the `inject` call.

{% highlight javascript %}
'use strict';
describe('memory test', function () {
  // beforeEach(module('app'));
  // beforeEach(inject());
  describe('testing', function () {
    it ('should grow in memory', function (done) {
      setTimeout(function () {
        for (var i = 1; i < 100; i++) {
          var result = Math.pow(i, 2);
          expect(result).to.be.eql(Math.pow(i, 2));
        }
        done();
      }, 500);
    });
    // repeat 500 times
  });
});
{% endhighlight %}

<img src="/dist/images/blog/angular-unit-test-memory-problems/profile-3.gif" alt="Memory round 3" />

And there we had it. My memory didn't move, and if it did by the last few tests, it quickly dropped back down to 119MB. It became clear that when we call `inject`, things were being created and they weren't being recycled. I dove into the source code for angular mocks, which defines `window.inject`, but it was nothing more than a <a href="https://github.com/angular/angular.js/blob/472d076cca2ffb99bd87d3c026ef69afc713268d/src/ngMock/angular-mocks.js#L2400-L2443" target="_blank">wrapper for `angular.injector` and `$injector.invoke`</a>, which produces the <a href="https://docs.angularjs.org/api/auto/service/$injector" target="_blank">`$injector`</a> service and resolves the dependencies.

It's basically an easy way to do:

{% highlight javascript %}
var injector = angular.injector(['ng', 'app']]);
injector.invoke(function (ServiceA, ServiceB, ..) {
  // your injected services
});
{% endhighlight %}

It seemed as if the problem was out of our hands.

## Solution
As we clearly don't want to muck around with the internals of angular and its most important service, `$injector`, we decided to do the easy thing. The "easy thing" is usually what an engineer may overlook.

We split up our unit tests into multiple runs. Instead of one giant run, we had a handful of runs:

{% highlight javascript %}
//..
karma: {
  controllers: {
    configFile: 'karma.conf.js',
    options: {
      files: karmaFiles.concat(['angular/test/spec/controllers/*.js']),
      port: 8080,
      proxies: getKarmaProxies(8080)
    }
  },
  directives: {
    configFile: 'karma.conf.js',
    options: {
      files: karmaFiles.concat(['angular/test/spec/directives/*.js']),
      port: 8081,
      proxies: getKarmaProxies(8081)
    }
  },
  ...
}
//..
grunt.task('unittest', [
  'karma:controllers',
  'karma:directives',
  //..
]);
{% endhighlight %}

As we were no longer limited to a single browser instance that couldn't support all the tests, our units were able to execute in batches without exceeding any memory limits. The tests were broken down into groups that ran separately -- controllers, directives, services, etc. We updated our Gruntfile to add a handful of new rules to Karma, threw up a build on Travis, and watched it successfully build without failing.

## Lessons &amp; Moving Forward
If your tests are growing too large for your environments to handle, break them up into multiple runs.

Also consider this rule for your angular module itself. We currently have things living in one big house, when they should really be broken down into different modules ('app.services', 'app.controllers', etc). This provides for a much lighter footprint when `module()` and `inject()` get called with angular mocks. It will produce a much lighter object, rather than carrying the entire weight of the application. This will be one of the next chores we do for improving our test environment.

I hope this helps someone trying to narrow down their problem. If you've solved this problem another way, I'd love to hear what you did below in the comments.
