---
layout: post
title: Streaming to Chromecast with Titanium Appcelerator
date: 2015-06-01 12:00:00
permalink: /blog/streaming-chromecast-titanium-appcelerator
tags: [titanium]
project: https://github.com/ajwhite/titanium-chromecast
excerpt: Introducing a Javascript Chromecast integration for Titanium Appcelerator projects.
seo_description: Connect and stream to Chromecast in Javascript with your Titanium Appcelerator application using titanium-chromecast.
disqus_id: '494 http://www.atticuswhite.com/?post_type=post&#038;p=494'
---

At work we use Titanium for one of our mobile applications and over the past year I've started to dig into the deeper waters of <a href="http://www.appcelerator.com/" title="Titanium Appcelerator - Mobile App Development Platform">Titanium Appcelerator</a>. We hit some areas where we needed to take advantage of the platform behind the abstraction layer and harness the tools that can only work in a native environment, in this case, the <a href="https://developers.google.com/cast/docs/ios_sender" title="iOS Google Cast API">iOS Google Cast SDK</a>.

I wanted the end goal to be a very simple and friendly implementation where we're dealing with objects and event driven patterns and avoid the spaghetti that could become of working behind the scenes with Titanium. We wanted to act as if there was no proxy on the Javascript ends.

So out comes <a href="https://github.com/ajwhite/titanium-chromecast" title="A Titanium Appcelerator GoogleCast module">titanium-chromecast</a>. It was built in the mindset of working with objects and that contain their own state and functionality, and avoid a system of just passing around identifiers. We should be able to get a Chromecast `device` and connect directly to it, for example <code class="highlight">device.connect()</code> and pretty much be done with it.

The end result looks like:
{% highlight javascript %}
// reference the module
var Chromecast = require('com.atticoos.titanium.chromecast');

// create an instance of the device manager
var deviceManager = Chromecast.createDeviceManager({
  app: 'APP_ID'
});

// start scanning and listening for chromecast devices
deviceManager.addEventListener('deviceOnline', function (event) {
  var device = e.device;

  // connect to the device
  device.connect(function () {

    // start the application
    device.launchApplication(function () {

      // send the application a message
      device.sendJsonMessage({foo: 'bar'});
    });
  });
});
{% endhighlight %}

And there you have it. We scanned for devices, connected to one, started the application, and started interacting with the application. The only problem I have with the code above is the "callback hell"; more about the challenges of promises below.

Casting video is also very simple (this feature is pending a release in the second week of June 2015).

{% highlight javascript %}
device.launchApplication(function () {
  device.castVideo({
    video: {
      src: 'path/to/video',
      contentType: 'video/mp4'
    },
    metadata: {
      title: 'The title of your stream',
      subTitle: 'Some subtitle content',
      image: {
        src: 'path/to/thumbnail',
        width: 400,
        height: 400
      }
  });
});
{% endhighlight %}

## Installation

This project exists on the <a href="http://gitt.io/" title="Titanium Appcelerator module package manager">gitTio</a> package manager.
{% highlight sh %}
gittio install com.atticoos.titanium.chromecast
{% endhighlight %}

## How it works and things to improve.

The one thing I really dislike about the current implementation is the "callback hell". To understand why it's complicated to introduce that, you'll first want to understand how Titanium modules are built.

You'll notice that we're able to interact with the Chromecast device directly through the instances of device objects that the module gives back to us. For example, we don't have a giant singleton module that we provide commands. There's more of a separation of concerns, where we have a service that scans for devices, gives us a device component, and allows us to start interacting with it (rather than interacting with a single service and telling it which device to do what action). If we receive a device, we can invoke commands directly on that device object.

All of these devices and services map back into a native counterpart. So when we have a device with a method <code class="highlight">launchApplication()</code>, that will cross a bridge and invoke a method on the native instance of the device. This is our device proxy. We can provide it a callback function, which Titanium wraps with another proxy class, <code class="highlight">KrollCallback</code>, which let's us execute the callback to Javascript from our Objective-C code. It looks a little something like this:

{% highlight objective-c %}
-(void)launchAppliation:(id)args
{
  ENSURE_TYPE([args objectAtIndex: 0], KrollCallback);
  self.onApplicationSuccessfullyLaunchedCallback = [args objectAtIndex: 0];
  [self.deviceManager launchApplication];
}
{% endhighlight %}

And then when the application launches, our delegate (defined by chremecast's sdk) gets invoked, and then we bubble that event back out to Javascript:
{% highlight objective-c %}
-(void)deviceManager:(GCKDeviceManager *)deviceManager didConnectToCastApplication:(GCKApplicationMetadata *)applicationMetaData sessionID:(NSString *)sessionID launchedApplication:(BOOL)launchedApplication
{
  [self.device.onApplicationSuccessfullyLaunchedCallback call:@[sessionID] thisObject:self.device];
}
{% endhighlight %}

And if we look back at our javascript, we can see that the function we pass in will eventually get called with the `this` context being the device object once the application has launched
{% highlight javascript %}
device.launchApplication(function onApplicationSuccessfullyLaunchedCallback (sessionID) {
  console.log('our application launched with a sessionID of', sessionID);
});
{% endhighlight %}

## Why are promises hard in Titanium modules?

In an ideal scenario, we'd have something less like the code examples above, and something more like:
{% highlight javascript %}
device.connect().then(function () {
  return device.startApplication();
}).then(function (session) {
  return device.sendJsonMessage({foo: 'bar'});
}).catch(function (error) {
  // an error along the way.
});
{% endhighlight %}

So why is that so hard? Why aren't we using a standard <a href="https://github.com/promises-aplus/promises-spec">A+ promise model</a>?

When we discussed the device model, and how it has a native counterpart, anything that comes back from our native layer requires a native counterpart if you anticipate interacting with it. So if we're going to introduce a promise pattern, we'd need to build the promise layer into Objective-C, and integrate a proxy interface to it. Every asynchronous call to the native layer would need to return a contextual promise instance back. This is certainly doable, but its development doesn't quite fit into this project. It would be better suited as a dependency of the project that can be shared among any Titanium modules that experience asynchronous behavior.

----

I welcome all to contribute to the project, especially regarding the promise spec. It's on my roadmap, but a very low priority at this point in time. If you want to use this project, yet you (understandably) hate introducing a callback model into your beautiful promise-based project - I don't blame you for being apprehensive. Be on the lookout for that update, I'll release a new major version with the changes. Until then, if you're eager, feel free to open a pull request over at the <a href="https://github.com/ajwhite/titanium-chromecast">github repo</a>. Otherwise it'll be on the roadmap!
