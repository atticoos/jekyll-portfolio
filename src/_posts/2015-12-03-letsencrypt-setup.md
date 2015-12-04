---
layout: post
title: Setting up Let's Encrypt Certificates
date: 2015-12-04 00:32:00
permalink: /blog/lets-encrypt-setup
tags: [letsencrypt]
excerpt: Let's Encrypt provides free SSL certificates and an open source client for generating and setting up your certificates. A movement to encrypt the web. Here we look at how to use the Let's Encrypt tool.
seo_title: Setting up SSL Certificates with Let's Encrypt
seo_description: Let's Encrypt provides free SSL certificates. Learn how to set up and install a Let's Encrypt SSL Certificate for Apache
disqus_id: '2015-12-04-lets-encrypt-setup'
---

Let's Encrypt has opened the floodgates of their public beta today, December 4th 2015. Today marks a milestone towards encrypting the web. In this post we'll look at how to use this new tool to generate a free SSL certificate.

<img src="/dist/images/blog/lets-encrypt-setup/encrypted.png" alt="SSL activated" />

This article assumes you have a web server and Apache. You're also going to want to have two SSH windows open, as the generator will have a few prompts and instructions to set up verification.

The workflow is broken into 3 segments:

1. Choosing a domain to create a certificate for
2. Verifying the domain
3. Configuring Apache to serve your site over SSL

## Installing the `letsencrypt` CLI tool

`ssh` into your server and clone the `letsencrypt` repository in your home directory and navigate into it.

{%highlight sh %}
git clone git@github.com:letsencrypt/letsencrypt.git
cd letsencrypt
{% endhighlight %}

## Requesting a certificate

In the cloned repository exists a script `letsencrypt-auto`. This typically will automatically generate a certificate and configure your web server. I tend to lean towards manually doing things, especially in beta. That turned out to be a good thing since it indeed failed for me <a href="https://github.com/letsencrypt/letsencrypt/issues/1712" title="Error installing Apache2 certificates" target="_blank">letsencrypt#1712</a>

We'll go ahead and start the manual flow

{% highlight sh %}
./letsencrypt certonly --manual
{% endhighlight %}

If this is the first time running the command, it will go ahead and download all the necessary packages. Let it run for a minute while it does that. You'll next be prompted to type in your `sudo` password.

Upon allowing root access, you'll enter a GUI flow of providing the domain(s) you'd like to generate certificates for

<img src="/dist/images/blog/lets-encrypt-setup/domain-entry.png" alt="enter a domain" />

This will next let you know that your IP will be publicly logged. Agree, if you're cool with that.

## Verifying your domain

Upon providing your domain name and agreeing that your IP will be logged, you'll now set up the verification. Here you'll want to open a **new** `ssh` window. This message is a prompt waiting for you to hit `ENTER` to confirm that you've set things up, so we'll leave this prompt as it is for now.


You should see output similar to

{% highlight sh %}
Make sure your web server displays the following content at
http://atticuswhite.com/.well-known/acme-challenge/THE_VERIFICATION_FILE before continuing:

THE_VERIFICATION_STRING

If you don't have HTTP server configured, you can run the following
command on the target server (as root):

mkdir -p /tmp/letsencrypt/public_html/.well-known/acme-challenge
cd /tmp/letsencrypt/public_html
printf "%s" THE_VERIFICATION_STRING > .well-known/acme-challenge/THE_VERIFICATION_FILE
# run only once per server:
$(command -v python2 || command -v python2.7 || command -v python2.6) -c \
"import BaseHTTPServer, SimpleHTTPServer; \
s = BaseHTTPServer.HTTPServer(('', 80), SimpleHTTPServer.SimpleHTTPRequestHandler); \
s.serve_forever()"
Press ENTER to continue
{% endhighlight %}

To summarize, you're going to create a file in your served directory that will be used to verify that you indeed own the location that the domain serves. This article assumes you're setting up an Apache server. If you have yet to set up a served directory, do that now. If you already have a directory that is serving your domain, navigate to that directory and create the following file path:

`.well-known/acme-challenge/THE_VERIFICATION_FILE` (ofcourse, `THE_VERIFICATION_FILE` should be what's described in the message from `letsencrypt-auto`)

Next you'll want put the verification string into the file.

{% highlight sh %}
cd /path/to/webserver/directory
mkdir -p .well-known/acme-challenge/THE_VERIFICATION_FILE
printf "%s" THE_VERIFICATION_STRING > .well-known/acme-challenge/THE_VERIFICATION_FILE
{% endhighlight %}

Verify that this file is properly being served before continuing. Navigate to http://your-domain.com/.well-known/acme-challenge/THE_VERIFICATION_FILE and make sure it's outputting the verification string.

Once you have this confirmed, go back to your other `ssh` window and confirm the prompt by hitting `ENTER`.

If verification was successful, you should receive a confirmation message containing the location of your certificate, chain, and private key file:

{% highlight sh %}
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at
   /etc/letsencrypt/live/your-domain.com/fullchain.pem. Your cert
   will expire on 2016-03-03. To obtain a new version of the
   certificate in the future, simply run Let's Encrypt again.
 - If like Let's Encrypt, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
{% endhighlight %}

Awesome! Now let's setup that cert.

## Configuring the certificates

Head over to your Apache configuration directory. Depending on what version of Apache you're running (Apache or Apache2) these next steps may vary. The overall configuration is the same in the end, however the directory structures are a bit different between the two.

{% highlight sh %}
cd /etc/apache2
{% endhighlight %}

We're going to set up 3 things:

1. The SSL mod
2. A cache mod
3. The SSL configuration

Inside `mods-available` will be `ssl.conf`, `ssl.load`, and `socache_shmcb.load`. If they do not exist in `mods-enabled`, you're going to link them.

{% highlight sh %}
sudo ln -s mods-available/ssl.conf mods-enabled/ssl.conf
sudo ln -s mods-available/ssl.load mods-enabled/ssl.load
sudo ln -s mods-available/socache_shmcb.load mods-enabled/socache_shmcb.load
{% endhighlight %}

That takes care of 1 and 2. Now we'll set up the SSL configuration.

Let's assume you already have the non SSL configuration set up. If you don't go ahead and set that up, we'll make sure that it redirects to the SSL version below.

Open the configuration file for the non SSL virtual host and enter the following:

{% highlight sh %}
<VirtualHost *:443>
  ServerName your-server.com
  DocumentRoot /path/to/your-server
  SSLEngine on
  SSLCertificateFile /etc/letsencrypt/live/your-domain.com/cert.pem
  SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
  SSLCertificateChainFile /etc/letsencrypt/live/your-domain.com/chain.pem
</VirtualHost>
{% endhighlight %}

Go ahead and verify your configuration (`service apache2 configtest`) or restart your web server, typically `service apache2 restart`. You should now be able to access your site over SSL!

## Redirecting non-SSL to your new SSL site

In order to do this, you'll need to make sure you have the `rewerite` mod enabled. If you don't see it in `mods-enabled`, go ahead and link it:

{% highlight sh %}
ln -s mods-available/rewrite.load mods-enabled/rewerite.load
{% endhighlight %}

In your site configuration, add the following lines:

{% highlight sh %}
RewriteEngine On
RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301, L]
{% endhighlight %}

Voilla! You're now secured. Give a big thanks to the team and community over at <a href="https://twitter.com/letsencrypt" title="Let's Encrypt" target="_blank">@LetsEncrypt</a> and on <a href="https://github.com/letsencrypt/letsencrypt" title="Let's Encrypt on Github" target="_blank">GitHub</a>!
