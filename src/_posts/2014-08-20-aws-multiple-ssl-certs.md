---
layout: post
title: Using AWS to serve multiple SSL certs on one server
date: 2014-08-20 12:34:00
permalink: /blog/aws-multiple-ssl-certs
tags: [aws]
excerpt: I've had some clients that require one server, many domains. I'm sure this may sound familiar. But what happens when this one box must serve multiple domains with SSL? You can't simply serve two different domain names over :443, as the connection must be established before the virtual host can be looked up, so we have a bit of a race condition. Using Load Balancers as proxies can solve this for us.
seo_title: Using AWS to serve multiple SSL certifications on one server
seo_description: Learn how to serve multiple SSL certificates on one server with Amazon Web Services (AWS) by utilizing Load Balancers and Apache configurations
disqus_id: '353 http://www.atticuswhite.com/?post_type=post&#038;p=353'
---

It's not a common problem, but it's a problem -- serving different SSL certs on one box for different domains.

## The problem
As some of you may know from experience, you can only host one domain's SSL cert at a time on a single server. The reason being that you must first establish a secure connection before anything can happen, which happens by default with a browser over :443. Only one SSL cert can be used on a port, because nothing can happen until a secure connection has been established. This means the server is unaware of the context, other than a secure handshake is being requested over :443 and it is going to pass along the certificate for the next phase of the handshake.

<img src="/dist/images/blog/aws-multiple-ssl-certs/tls-handshake.png" alt="TLS handshake" />

Let's take a look at what a basic Apache SSL configured Virtual Host may look like:

{% highlight html %}
NameVirtualHost *:443
<IfModule mod_ssl.so>
  <VirtualHost *:443>
    ServerName yourserver.com
    DocumentRoot /var/www/site
    SSLEngine on
    SSLCertificateFile ssl.crt
    SSLCertificateKeyFIle ssl.key
    SSLCertificateChainFile chain.crt
  </VirtualHost>
</IfModule>
{% endhighlight %}

Unfortunately, we can not add any more Virtual Hosts to :443. Before Apache loads up the virtual host and serves anything, the handshake must have been successful -- meaning the certificate would have already been delivered and the connection has been established for the domain attached to :443. That means we cannot add another VirtualHost and let apache decide which SSL certificate to choose, as there's no context yet of what is being requested until the connection is securely established -- and then this information may be passed through it.

## Server Name Indication
SNI is an extension to the SSL protocol (<a href="http://www.ietf.org/rfc/rfc4366.txt" target="_blank">RFC 4366</a>) changing the way the SSL handshake works. This allows for multiple host names to be servable over a single :443 port configuration. The way it works is by the client including the requested hostname in the first message during the handshake, which would allow Apache to determine which certificate it should use -- essentially which Virtual Host the request is for. Browsers must support this in order for it to work. However, this post is not about SNI, but the workaround without SNI. (<a href="http://en.wikipedia.org/wiki/Server_Name_Indication" target="_blank">More on SNI</a>)

## Current Workaround
There's a nifty trick that can be done with Load Balancers on Amazon Web Services. The way the load balancer works is by sticking itself on the public facing end of your servers and handling all incoming traffic, and then forwarding it along to your server. So -- traffic coming in on :80 on the load balancer will be forwarded to :80 on an active instance of your web server. Port :443 requests will similarly come through the public facing load balancer, and forward along to your instance's :443 port.

We've put a layer between the client and our server, so that means we can pretty much do whatever we want between the Load Balancer and the server... If we accept incoming traffic on `:443` on the Load Balancer, what if we forwarded it to port :*8443 on the server? Well, it'd work just like it did before, but we can guarantee browsers can communicate on :8443 because we have connections coming in on the load balancer over :443 and forwarding to :8443 on the server.

This means we can set up a virtual host on `:8443` AND `:443`.

Let's first look at how the Load Balancer works.

<img src="/dist/images/blog/aws-multiple-ssl-certs/load-balancer.jpg" alt="load balancing" />

The browser makes the request to a domain, which is pointing to the load balancer. The Load balancer is configured with the cert so it can establish the secure connection over `:443`, and then forwards the request with a secure connection to the server, over `:443` as well.

Now let's assume we have 3 domains we want to serve securely from one server.

<img src="/dist/images/blog/aws-multiple-ssl-certs/dns-zones.jpg" alt="three DNS zones" />

We'll create a Load Balancer for each one of these domains to point to.

<img src="/dist/images/blog/aws-multiple-ssl-certs/dns-zones-lbs.jpg" alt="three DNS zones mapped to three lbs" />

And then finally, we'll configure each one of these Load Balancers to point to the server.

<img src="/dist/images/blog/aws-multiple-ssl-certs/dns-lb-proxy.jpg" alt="DNS load balancer proxy" />

As you notice in the diagram above, the Load Balancers are pointing to the server, but forwarding to a different port than the incoming traffic. Since each Load Balancer is separate from the other one -- each one of these Load Balancers can be configured with a SSL certificate specific to the Domain pointing to it. Then we can forward this request to a specific port on the server, and make the server listen on each one of these different ports.

We now support 3 different scenarios:

The user makes a request to Domain A, which is pointing to Load Balancer A, and finishes with a connection to the server on `:443` (LB) to `:443` (server).

The user makes a request to Domain B, which is pointing to Load Balancer B, and finishes with a connection to the server on `:443` to `:8443`.

The user makes a request to Domain C, which is pointing to Load Balancer C, and finishes with a connection to the server on `:443` to `:8444`.

Assume the following configuration for Apache:

{% highlight html %}
NameVirtualHost *:443
<IfModule mod_ssl.so>
  <VirtualHost *:443>
    ServerName domain_a.com
    DocumentRoot /var/www/site_a
    SSLEngine on
    SSLCertificateFile ssl_a.crt
    SSLCertificateKeyFIle ssl_a.key
    SSLCertificateChainFile chain.crt
  </VirtualHost>

  <VirtualHost *:8443>
    ServerName domain_b.com
    DocumentRoot /var/www/site_b
    SSLEngine on
    SSLCertificateFile ssl_b.crt
    SSLCertificateKeyFIle ssl_b.key
    SSLCertificateChainFile chain.crt
  </VirtualHost>

  <VirtualHost *:8444>
    ServerName domain_c.com
    DocumentRoot /var/www/site_c
    SSLEngine on
    SSLCertificateFile ssl_c.crt
    SSLCertificateKeyFIle ssl_c.key
    SSLCertificateChainFile chain.crt
  </VirtualHost>
</IfModule>
{% endhighlight %}

Now apache has a different secure virtual host for each one of these new ports -- :443, :8443, and :8444 -- which can be any available port # of your choosing.

The main idea here is that:

- The browser must connect to a `:443` port
- So we create a load balancer for each domain that accepts a `:443` port
- Apache cannot have multiple ssl certs on the same virtual host, so we split these up into their own ports
- We forward each of these load balancers to their respective port on the server

Now we have a server that is capable of serving different domains with SSL certs by proxying secure connections over load balancers!

## Setting up your DNS
There is one gotcha to all of this -- if you're going to be pointing an A record to a Load Balancer, an A record can only accept an IP address. So if you were to point "domain_a.com" to something, you'd have to use the IP address. "www.domain_a.com" can use a CNAME entry, and you can use the canonical name.

AWS Load Balancers must be pointed to by their CNAME's, as their IPs are not static -- they frequently change. To get around this, Route 53 introduces Alias A records -- which is basically a CNAME, but a bit different in how it works. Alias records can point to the Load Balancers you have set up, so you can easily have you domain pointing to a non IP address. (<a href="http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html" target="_blank">Route 53 Alias Record Sets</a>)
