---
layout: post
title: Wordpress Page Models for Custom Post Types
date: 2014-10-05 18:58:00
permalink: /blog/wordpress-page-models
tags: [wordpress]
excerpt: If your Wordpress projects use a lot of custom fields, it may be a good idea to prepare all the data a page may need outside of the view. I've started to introduce page models to my projects, where all the fields are gathered and prepared before I use them in my templates.
seo_title: Wordpess page models for custom post types
seo_description: Introducing Wordpress page models to take care of all your custom fields from your Wordpress custom post types
---

If you've developed a WordPress project before, then you've likely used <a title="Wordpress Custom Post Types" href="http://codex.wordpress.org/Post_Types" target="_blank">custom post types</a> coupled with <a title="Advanced Custom Fields" href="http://www.advancedcustomfields.com/" target="_blank">custom fields</a>. These are terrific for making a vanilla WordPress installation capable of managing all the dynamic pieces that make up a page that a client may require. You can keep things easy to use and organized for your client on the backend, but your code is usually a different story.

Custom fields are terrific, but you frequently end up littering your markup with many inline PHP get_field requests, checking conditionals, applying filters, etc. You should minimize this and maximize your separation of responsibility as much as possible. I've recently started doing this by creating data models for my pages.

Let's take a look at an example home page:

<a href="#"><img src="/dist/images/blog/wordpress-page-models/custom-fields.png" alt="Advanced Custom Fields" /></a>

We have a handful of fields that will represent different parts of the page.

- Top banner section
- Featured content section
- Bottom banner section

Our markup could easily end up looking like so:

{% highlight html %}
<div class="something">
  <?php
    $bannerImage = get_field('top_banner_image');
    if (empty($bannerImage)) {
      $bannerImage = get_field('default_banner_image', 'option');
    }
  ?>
  <header style="background-image: url(<?php echo $bannerImage; ?>)">
    <h1><?php the_field('top_title'); ?></h1>
    <p><?php the_field('top_excerpt'); ?></p>
  </header>
  <section>
    <?php while(have_rows('featured_items')) : the_row();
      $itemOne = get_sub_field('item1');
      $itemTwo = get_sub_field('item2');
      $itemThree = get_sub_field('item3');
    ?>
    <div>
      <h2><?php echo $itemOne; ?></h2>
      <p><?php echo $itemTwo; ?></p>
      <span><?php echo $itemThree; ?></span>
    </div>
    <?php endwhile; ?>
  </section>
  <footer>
    <h1><?php the_field('bottom_title'); ?></h1>
    <p><?php the_field('bottom_excerpt'); ?></p>
  </footer>
</div>
{% endhighlight %}

This is where I like to introduce a data model to the page that does all the data gathering and preparation before using it in my view. Coming from a software background, this feels a lot cleaner than mixing it all together. The model looks like so:

{% highlight php %}
<?php

class WP_PageModel {
  function __construct ($postID = false) {
    global $post;
    $this->postID = $postID ? $postID : $post->ID;
  }

  protected function fillModelAttributes(&$attribute, $data) {
    $attribute = new stdClass();
    foreach ($data as $key=>$value) {
      $attribute->$key = $data;
    }
  }
}

class HomePageModel extends WP_PageModel {
  var $top;
  var $features;
  var $bottom;

  function __construct ($postID = false) {
    parent::__construct($postID);
    $this->fetchTop();
    $this->fetchFeatures();
    $this->fetchBottom();
  }

  function fetchTop () {
    $image = get_field('top_background_image');
    $image = !empty($image) ? $image : get_field('default_banner_image', 'option');
    $topModel = array (
      'image' => $image,
      'heading' => get_field('top_title', $this->postID),
      'excerpt' => get_field('top_excerpt', $this->postID))
    );
    $this->fillModelAttributes($this->top, $topModel);
  }

  function  fetchFeaturedItems () {
    $this->fillModelAttributes($this->featuredItems, array(
      'items' => get_field('featured_items', $this->postID);
    ));
  }

  function fetchBottom () {
    $bottomModel = array (
      'heading' => get_field('heading_bottom', $this->postID),
      'excerpt' => get_field('excerpt_bottom', $this->postID)
    );
    $this->fillModelAttributes($this->bottom, $bottomModel);
  }
}
{% endhighlight %}

We end up building an object that has the properties for each section: top, featuredContent, bottom. We now have easy access to these properties to spit out and repeat over in our markups.

{% highlight html %}
<?php $page = new HomePageModel(); ?>
<div class="something">
  <header style="background-image: url(<?php echo $page->top->image; ?>)">
    <h1><?php echo $page->top->title; ?></h1>
    <p><?php echo $page->top->excerpt; ?></p>
  </header>
  <section>
    <?php foreach($page->featuredItems as $item): ?>
    <div>
      <h2><?php echo $item['item1']; ?></h2>
      <p><?php echo $item['item2']; ?></p>
      <span><?php echo $item['item3']; ?></span>
    </div>
    <?php endforeach; ?>
  </section>
  <footer>
    <h1><?php echo $page->bottom->title ?></h1>
    <p><?php echo $page->bottom->excerpt; ?>
  </footer>
</div>
{% endhighlight %}
