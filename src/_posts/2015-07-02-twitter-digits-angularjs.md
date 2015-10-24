---
layout: post
title: Twitter Digits for AngularJS
date: 2015-07-02 13:08:00
permalink: /blog/twitter-digits-angularjs
tags: [angularjs]
---

Twitter recently came out with their web version of [Digits](digits 'Twitter fabric digits'). It provides a nice way to authenticate with applications with what is traditionally known as two-step authentication, but it becomes more of a primary authentication in how they've targetted it.

![twitter digits signin flow](/dist/images/blog/twitter-digits/signin-dialog.png)

## angular-digits

[angular-digits](angular-digits, 'angular-digits on Github') provides an integration of [Digits](digits 'Twitter fabric digits') with AngularJS. It brings the asynchronous event sinto the digiest cycle context, but it also provides a handful of utility on top of what is otherwise a pretty raw interface.

## Example Usage

{% highlight javascript %}
// inject the digits module
angular.module('app', ['atticoos.digits'])

.config(function (DigitsProvider) {
  // configure the Digits provider with your consumer key before the application's run phase
  DigitsProvider.setConsumerKey('YOUR_CONSUMER_KEY');
})

.run(function (Digits) {
  // Enter the auth flow
  Digits.login().then(function (loggedInResponse) {
    // successfully authenticated
    console.log('Authorization headers', loggedInResponse.getOAuthHeaders());
  }).catch(function (loginError) {
    if (loginError.wasPopupBlocked()) {
      // popup was blocked
    } else if (error.wasWindowClosed()) {
      // window was closed
    } else {
      // a problem with authentication occured
    }
  });
});
{% endhighlight %}

That's pretty much the gist. We have a nice promise based implementation, along with some response models that make it easy to ask the model questions about what type of error occurred that prevented a successful authentication, or to retrieve the authorization headers after a successful authentication.

## Installation

The package is available on bower
{% highlight sh %}
bower install angular-digits
{% endhighlight %}

{% highlight javascript %}
angular.module('app', ['atticoos.digits']);
{% endhighlight %}

## Twitter Flight

If you missed the Twitter Flight conference, they had a good segment on announcing Digits that's worth checking out<br/>
<iframe width="100%" height="420" src="https://www.youtube.com/embed/KilgexyjPsA" frameborder="0" allowfullscreen></iframe>

[digits]: https://get.fabric.io/digits
[angular-digits]: https://github.com/ajwhite/angular-digits
