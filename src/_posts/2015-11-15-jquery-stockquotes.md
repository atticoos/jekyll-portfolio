---
layout: post
title: jQuery Stock Quotes
date: 2015-11-15 10:30:00
permalink: /blog/jquery-stock-quotes
project: https://github.com/ajwhite/jquery-stockquotes
tags: [js]
excerpt: jQuery Stock Quotes is a jQuery plugin that allows developers to seamlessly show stock symbol information.
seo_title: jQuery Stock Quotes - stock symbol plugin
seo_description: jQuery Stock Quotes is a jQuery plugin that allows developers to seamlessly show stock symbol information.
disqus_id: '2015-11-15-jquery-stock-quotes'
---

<a href="https://github.com/ajwhite/jquery-stockquotes" target="_blank" title="jQuery Stock Quotes">jQuery Stock Quotes</a> is a plugin that allows you to show stock symbol information. By adding a `data-symbol` attribute to the elements, you'll be able to display the stock symbol along with the latest quote.

You can install this with Bower, `bower install jquery-stockquotes --save`

{% highlight html %}
<!-- import jQuery and the plugin -->
<script src="bower_components/jquery/jquery.js"></script>
<script src="bower_components/jquery-stockquotes/dist/jquery.stockquotes.js"></script>
<link rel="stylesheet" type="text/css" href="bower_components/jquery-stockquotes/dist/jquery.stockquotes.css" />

<!-- the HTML integration -->
Twitter:  <span class="stock-quote" data-symbol="TWTR"></span>
Facebook: <span class="stock-quote" data-symbol="FB"></span>
Google:   <span class="stock-quote" data-symbol="GOOGL"></span>
Netflix:  <span class="stock-quote" data-symbol="NTFLX"></span>
Yahoo:    <span class="stock-quote" data-symbol="YHOO"></span>

<!-- the JS integration -->
<script>
$(document).on('ready', function () {
  $('.stock-quote').stockQuotes();
});
</script>
{% endhighlight %}

This will produce the following

<img src="/dist/images/labs/jquery-stockquotes.png" alt="jQuery Stock Quotes" />
