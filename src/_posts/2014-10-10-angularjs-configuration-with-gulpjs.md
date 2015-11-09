---
layout: post
title: Using GulpJS to Generate Environment Configuration Modules
date: 2014-10-10 00:26:00
permalink: /blog/angularjs-configuration-with-gulpjs
tags: [gulpjs, angularjs]
project: https://github.com/ajwhite/gulp-ng-config
excerpt: gulp-ng-config, a GulpJS build task plugin, will generate AngularJS constant modules from JSON files to assist in providing configurations for your projects.
seo_title: gulp-ng-config - GulpJS config generator for Angular constants
seo_description: gulp-ng-config - A GulpJS build task plugin used to generate AngularJS configurations. Support multiple environments for your AngularJS projects.
disqus_id: '403 http://www.atticuswhite.com/?post_type=post&#038;p=403'
---
If you're building an Angular application, your application is probably dependent on the proper environment. When working locally, you need to access a local set of services, when in production mode, you need your production set of services. Nothing new here. But what is new is a GulpJS task plugin I've been working on, <a title="AngularJS configuration generator gulp-ng-config by Atticus White" href="https://npmjs.org/package/gulp-ng-config" target="_blank">gulp-ng-config</a>, that will build your environment configuration as specified by your build task.

Let's assume we have a simple AngularJS application that uses some <a title="AngularJS $resource" href="https://docs.angularjs.org/api/ngResource/service/$resource" target="_blank">$resources</a>. In this, very poor example, we set the configuration on the rootScope for the location of our API. Our NoteService, which is the factory for our $resource, uses this as the configured location of the API.

{% highlight javascript %}
angular.module('myApp', ['ngResource'])
.run(['$rootScope', function myApp ($rootScope) {
  $rootScope.baseUrl = 'https://mywebserver.com/api';
}]);

angular.module('myApp').factory('NoteService', ['$resource',
  function NoteService ($resource) {
    return $resource($rootScope.baseUrl + '/notes/:id');
  }
]);
{% endhighlight %}

As we see here, or even if we tried this with a number of different examples, we're leaving our API's URL in our code, which like any configuration, isn't exactly how you want things set up. A better scenario would be if we had a service holding our configuration. That's one step in the right direction:

{% highlight javascript %}
angular.module('myApp.config', [])
.constant('EnvironmentConfig', {
  baseUrl: 'http://mywebserver.com/api'
});

angular.module('myApp', ['ngResource', 'myApp.config']);
angular.module('myApp').factory('NoteService', ['$resource', 'EnvironmentConfig',
  function NoteService ($resource, EnvironmentConfig) {
    return $resource(EnvironmentConfig.baseUrl + '/notes/:id');
  }
]);
{% endhighlight %}

But how do we get here without that being hard-coded into our project? By using a JSON file, one for each of our environments (there will be improvements to this approach upcoming), we can generate this configuration component as a build task.

Let's look at the following configuration file:

{% highlight json %}
{
  "EnvironmentConfig": {
    "environment": "local",
    "baseUrl": "http://localhost:8080/api",
    "somethingElse": {
      "property": "value"
    }
  }
}
{% endhighlight %}

We can construct a build task using <a title="AngularJS configuration generator gulp-ng-config by Atticus White" href="https://npmjs.org/package/gulp-ng-config" target="_blank">gulp-ng-config</a> to use this JSON file as the source of the stream, and output on the other end the Angular module containing the constant.

{% highlight javascript %}
var gulp = require('gulp'),
    gulpNgConfig = require('gulp-ng-config');

gulp.task('configuration', function () {
  gulp.src('config.json')
  .pipe(gulpNgConfig('myApp.config'))
  .pipe(gulp.dest('app/'));
});
{% endhighlight %}

And that will produce:

{% highlight javascript %}
angular.module('myApp.config', [])
.constant('EnvironmentConfig', {
  environment: 'local',
  baseUrl: 'http://mywebserver.com/api',
  somethingElse: {
    property: 'value'
  }
});
{% endhighlight %}

Since this ends up in the project directory, we can have our angular project include the file and our main application can now use it as a dependency.

If you'd like to use this GulpJS component, it's a simple `npm install gulp-ng-config`. You can always contribute or open issues at <a title="Atticus' Github repository for gulp-ng-config" href="https://github.com/ajwhite/gulp-ng-config" target="_blank">https://github.com/ajwhite/gulp-ng-config</a>
