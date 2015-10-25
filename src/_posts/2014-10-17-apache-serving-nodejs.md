---
layout: post
title: Configuring Apache to Serve your NodeJS Application
date: 2014-10-17 15:37:00
permalink: /blog/apache-serving-nodejs
tags: [nodejs]
excerpt: With a few simple steps, learn how to configure your Apache server to serve your Node JS applications
---

Most people are fine just loading up their NodeJS server by a quick localhost:8080 request, but sometimes it's also useful to have an actual hostname available, especially when you're integrating with OAuth services that may require a qualified domain name for their redirect url. In this event, we need a way to tie Apache and Node together. Luckily it's easy.

Let's assume we have a node application running on `:4567`
{% highlight javascript %}
var http = require('http'),
server = http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
});

server.listen(4567);
{% endhighlight %}

We can successfully load up `localhost:4567`, but now we'd like to tie it up to be proxied by a hostname, say `local.example.com:80`

A typical Apache configuration would normally look like this, for serving your standard web directory
{% highlight html %}
<VirtualHost *:80>
  ServerName   local.example.com
  DocumentRoot "/var/www/html/com.example.local"
  ErrorLog     "/var/log/httpd/com.example.local-error_log"
  CustomLog    "/var/log/httpd/com.example.local-access_log" common

  <Directory "/var/www/html/com.example.local">
    AllowOverride All
    Order allow,deny
    Allow from all
  </Directory>  
</VirtualHost>
{% endhighlight %}

That should look pretty familiar to anyone who's spawned up a couple apache servers before. This would allow us to hit `local.example.com`, granted we stuff that into our `/etc/hosts`, and be served whatever is in our `/var/www/html/com.example.local` directory.

For anyone following along hands on, for this to work, make sure you edit your `/etc/hosts` file (sudo required) and enter:

{% highlight text %}
127.0.0.1   local.example.com
{% endhighlight %}

This is required for the `local.example.com` hostname to resolve to our local machine. Moving forward, here's the changes we'll want to make so that our Apache server will, instead of serving a directory, proxy requests into our node application:

{% highlight html %}
<VirtualHost *:80>
  ServerName local.example.com
  ErrorLog   "/var/log/httpd/com.example.local-error_log"
  CustomLog  "/var/log/httpd/com.example.local-access_log" common

  ## Here's our magic
  ProxyRequests off

  <Proxy *>
    Order deny,allow
    Allow from all
  </Proxy>

  <Location /> # no, this closing tag is not a typo
    ProxyPass        http://localhost:4567 # Our port goes here
    ProxyPassReverse http://localhost:4567
  </Location>
</VirtualHost>
{% endhighlight %}

Now you will be able to successfully load your node application from `http://localhost:4567` over `http://local.example.com`
