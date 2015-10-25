---
layout: post
title: Digital Smart Mirror lab with React Native
date: 2015-10-01 22:34:00
permalink: /blog/react-native-smart-mirror-lab
tags: [react]
project: https://github.com/ajwhite/MagicMirror
excerpt: Learn how to build your own digital smart mirror with React Native. A perfect DIY hack for a weekend when you want to develop something cool.
seo_title: Digital Smart Mirror lab with React Native
disqus_id: '616 http://atticuswhite.com/?post_type=post&#038;p=616'
---
Here's a perfect weekend hack. Grab that old clunky Kindle Fire or any other tablet you have kicking around the dust and put it to good use (weird that we can call these things old now eh?). We're going to make a Smart Mirror. I chose to use React Native for this, but you can do this with any stack that will run on a tablet (such as a webpage).
You can find this project on <a href="https://github.com/ajwhite/MagicMirror" target="_blank">github.com/ajwhite/MagicMirror</a>.

There's not a whole lot to this project, it's a perfect DIY for a developer who wants to make some cool things for the house. The Internet-of-Things is a growing trend and, we the developers, are the privileged ones who get to make them ourselves and command them do exactly what we want them to do. I never thought I'd be telling a mirror what to do unless I was arguing with myself in front of one.
Times 'a changin'.


Onwards!
<img src="/dist/images/blog/react-native-smart-mirror-lab/preview.jpg" alt="Magic Mirror Preview" class="boxy" />

This is only comprised of:

- Two way mirror (more expensive, harder to come by)
  <br/>OR
  <br/>Plexiglass &amp; <a href="http://www.homedepot.com/p/Gila-3-ft-x-15-ft-Mirror-Privacy-Window-Film-PRS361/100196546" target="_blank">Mirror Film</a> (cheaper option)
- Black construction paper (or something else dark that you can stick on the back)
- Velcro (or something that you can mount the tablet onto the glass)
- ... A tablet. You won't need anything fancy for this.


So let's get started:

## 1. Create your mirror
This is probably the hardest part if you're going the Plexiglass + Mirror Film route. For a relatable experience, we're basically putting a screen protector on a 4 foot smart phone. Not fun. If you're using a two-way mirror, go ahead to the next step.

I used the <a href="http://www.homedepot.com/p/Gila-3-ft-x-15-ft-Mirror-Privacy-Window-Film-PRS361/100196546" target="_blank">Gila Mirror Privacy Window Film</a>. These Gila folks certainly seem to enjoy making <a href="http://www.gilafilms.com/help-how-tos" target="_blank">instructional videos</a>, so you're in luck. Make sure you do this on a nice flat surface. It'll be helpful to have another person help you apply it. I can attest that this can be done on your own, since I don't have friends. So holster your impatience and do it slowly if you're on your own. If you're the crafty type, or good with your hands, you'll have a breeze.

## 2. Black out the backside
A two-way mirror, by design, is going to let light through and look a bit opaque. You're going to want to flip over your mirror and line the back of it with something dark. I used construction paper. Make sure you leave some room for your tablet, since you want that to shine through.

At this point I tucked the tablet below the mirror to see how it looks. Don't mind the weird reflection.
<img src="/dist/images/blog/react-native-smart-mirror-lab/step2.jpg" alt="Magic Mirror step 2" class="boxy" />

## 3. Set up the mount
Chances are you're going to want to see how it looks while you're building your software. It's like night and day when you put the tablet behind the mirror and only the white text & icons shine through compared to looking at the emulator. I went ahead and set up my velcro mount at this point so I could have the tablet running on the mirror while developing the application and get the full effect. Make sure you do this carefully and let it sit for a few minutes. The glass on the tablet won't hold the adhesive as well as the mirror/plexiglass will, so the velcro on your tablet is likely to come lose if you remove it often. You've been warned.

(I ran out of construction paper at this point. Be advised, two pieces is not enough).
<img src="/dist/images/blog/react-native-smart-mirror-lab/step3.jpg" alt="Magic Mirror step 3" class="boxy" />

## 4. Create your app
Craft time is over, and onto development. We have two main goals here:

1. Create a view with a black background
2. Create white text

...And that's really it. This is the UI of the application that the photo at the top uses. It's crazy how something so basic can come out looking so good. Night and day.
<img src="/dist/images/blog/react-native-smart-mirror-lab/ui.png" alt="Magic Mirror Android UI" />

A this point it should be pretty clear that it doesn't matter what technology you choose to work with. I decided to use <a href="https://facebook.github.io/react-native/" target="_blank">React Native's</a> new Android release as an excuse to get my hands on it. You could just as easily wire this up with a webpage and load it up on your tablet.

Some cool ideas to get you started:

-The current date &amp; time</li>
- The weather powered by <a href="https://developer.forecast.io/" target="_blank">forecast.io</a>
- If you're in a metropolitan area and use public transportation with <a href="https://developers.google.com/maps/documentation/directions/intro" target="_blank">Google Maps Directions API</a>
- If you use <a href="https://robinpowered.com/" target="_blank">Robin</a> and <a href="http://estimote.com/" target="_blank">bluetooth Beacons</a>, use the <a href="https://robinpowered.com/developers" target="_blank">Physical Spaces API</a> to react when someone enters the room
- If you're on Github a lot, their <a href="https://developer.github.com/v3/activity/notifications/" target="_blank">notifications API</a>
- Stock quote ticker via <a href="http://dev.markitondemand.com/" target="_blank">Market Data API</a>
- Some latest <a href="https://dev.twitter.com/rest/reference/get/statuses/user_timeline" target="_blank">tweets</a>
- Latest news headlines (via <a href="https://developers.google.com/news-search/v1/devguide" target="_blank">Google News Search API</a>, although be warned that it's being deprecated

And there you have it! This is where I left off after hooking up my APIs.
<img src="/dist/images/blog/react-native-smart-mirror-lab/final-preview.jpg" alt="Magic Mirror completed" class="boxy" />

My implementation was really basic. Just a series of components. I still need to clean this up so I can control the visibility of the component from a higher level and not show rows that don't have any notifications.

{% highlight javascript %}
var DateView = require('./components/date'),
    TimeView = require('./components/time'),
    WeatherView = require('./components/weather'),
    StockView = require('./components/stock'),
    TwitterView = require('./components/twitter'),
    GithubView = require('./components/github'),
    CalendarView = require('./components/calendar');

var MagicMirror = React.createClass({
  render: function() {
    var stocks = ['FB', 'TWTR', 'AAPL', 'GOOGL', 'MSFT', 'TSLA'],
        twitterUsers = ['berniesanders', 'robinpowered', 'elonmusk'];
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <DateView></DateView>
        </View>
        <View style={styles.row}>
          <TimeView></TimeView>
        </View>
        <View style={[styles.row, styles.margin]}>
          <WeatherView></WeatherView>
        </View>
        <View style={[styles.row, styles.margin]}>
          <TwitterView users={twitterUsers}></TwitterView>
        </View>
        <View style={[styles.row, styles.margin]}>
          <GithubView></GithubView>
        </View>
        <View style={[styles.row, styles.margin]}>
          <CalendarView></CalendarView>
        </View>
        <View style={styles.stocks}>
          <StockView symbols={stocks}></StockView>
        </View>
      </View>
    );
  }
});
{% endhighlight %}

You can find my project over at <a href="https://github.com/ajwhite/MagicMirror" target="_blank">github.com/ajwhite/MagicMirror</a>.

This project was inspired by the original idea maker <a href="https://github.com/HannahMitt/HomeMirror" target="_blank">github.com/HannahMitt/HomeMirror</a> and a fellow dev <a href="https://github.com/plondon/BlackMirror" target="_blank">github.com/plondon/BlackMirror</a>.

<div style="text-align:center">
<a href="https://github.com/HannahMitt/HomeMirror" target="_blank" style="margin-right:10px;"><img src="/dist/images/blog/react-native-smart-mirror-lab/hannah-mitt-home-mirror.jpg" alt="HannahMitt" style="display: inline;"/></a><a href="https://github.com/plondon/BlackMirror" target="_blank"><img src="/dist/images/blog/react-native-smart-mirror-lab/phil-london-black-mirror.jpg" alt="BlackMirror" style="display: inline;" /></a>
</div>

## Future Integrations with Robin
<a href="https://robinpowered.com/" target="_blank">Robin</a>, while mainly used in offices (and being the place I work), has a really cool system called <a href="https://robinpowered.com/features#presence" target="_blank">Presence</a>. With the power of bluetooth beacons, along with the mobile app, Robin will be able to detect room entry/exit events and <a href="http://docs.robinpowered.com/" target="_blank">exposes an API</a> to these.

<img src="/dist/images/blog/react-native-smart-mirror-lab/robin-beacons.png" alt="Robin beacons" style="display: block; margin: 15px auto; max-width: 450px;" />

The next thing I plan to do here is have contextual information on the mirror depending on who's in the room. Instead of it always displaying my calendar, or the stocks or tweets that I'm interested in, with Robin it could show that in terms of the user who's currently in the room. You can see some examples of these requests on the <a href="https://robinpowered.com/developers" target="_blank">developer page</a>.

If you decide to build one, please link it in the comments below!
