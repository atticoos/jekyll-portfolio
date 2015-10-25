---
layout: post
title: AngularJS translate-once extension for angular-translate one-time binding support
date: 2015-06-02 12:00:00
permalink: /blog/angularjs-translate-once-angular-translate-one-time-binding
tags: [angularjs]
project: https://github.com/ajwhite/angular-translate-once
excerpt: Add one-time binding support for your AngularJS applications by extending angular-translate with translate-once
seo_title: AngularJS one-time binding support for angular-translate
---

Many of you are likely familiar with Pascal Precht's i18n localization library, <a href="https://github.com/angular-translate/angular-translate" title="AngularJS i18n angular-translate module" target="_blank">angular-translate</a>. It's well made, easy to use, and has a lot of configuration as to how you want to prepare or load your localizations. The only thing it lacks, in my and others opinions, is one-time binding (issues <a href="https://github.com/angular-translate/angular-translate/issues/738" target="_blank">#738</a>, <a href="https://github.com/angular-translate/angular-translate/issues/967" target="_blank">#967</a>, <a href="https://github.com/angular-translate/angular-translate/issues/1018" target="_blank">#1018</a>, and <a href="https://github.com/angular-translate/angular-translate/issues/1043" target="_blank">#1043</a>). This becomes a problem if you asynchronously load your localization files, which is a beneficial tool to large angular applications. Pascal writes about how to <a href="https://github.com/angular-translate/angular-translate/wiki/Asynchronous-loading" target="_blank">asynchronously load your localization files</a>. We personally use <a href="https://github.com/angular-translate/bower-angular-translate-loader-static-files" target="_blank">angular-translate-loader-static-files</a>. While the cost of evaluating translation expressions is relatively inexpensive, we still preferred throwing a one-time binding on it, and since we were early on in the project, I figured we'd provide a solution that could also benefit others in the community.

## translate-once Directive

<a href="https://github.com/ajwhite/angular-translate-once">`translate-once`</a> adds support for one-time bindings for translations with a new `translate-once`</a> directive. It extends the existing functionality of `angular-translate` and doesn't introduce any new dependencies. It is written to be considered an extension within the same namespace as `pascalprecht.translate`.

{% highlight html %}
<span translate-once="TRANSLATION_KEY"></span>
{% endhighlight %}

Installation is done via bower, and if you already include the `pascalprecht.translate` module into your angular project, you'll be good to go.

{% highlight sh %}
bower install angular-translate-once
{% endhighlight %}

## Why do we need this?

There's no good way to perform one-time bindings when asynchronously loading your static localization assets. One-time bindings for translations are useful for any instances of static copy.

- Page titles
- Navigation elements
- Static bylines, paragraphs, explainers, etc

Let's look at what is currently available in the `angular-translate` package.


Use it as a **filter**
{% highlight html %}
{{ 'TRANSLATION_KEY' | translate }}
{% endhighlight %}

Use it as a **directive**
{% highlight html %}
<span translate="TRANSLATION_KEY"></span>
{% endhighlight %}

Use it as a **directive with values **
{% highlight html %}
<span translate="TRANSLATION_KEY" translate-values="{foo: 'bar'}"></span>
{% endhighlight %}

Use it as a **directive and compile** elements formed from the translation
{% highlight html %}
<span translate="TRANSLATION_KEY" translate-compile></span>
{% endhighlight %}

Or even use it in within javascript in one of two ways:

**Asynchronously**
{% highlight javascript %}
$translate('TRANSLATION_KEY').then(function (translation) {
  alert(translation);
});
{% endhighlight %}

**Synchronously**
{% highlight javascript %}
alert($translate.instant('TRANSLATION_KEY'));
{% endhighlight %}

## But what about one-time binding?
Let's first look at some approaches one might make with the current toolkit. Intuitively, one might try to do this in how a standard one-time binding would work after <a href="http://blog.thoughtram.io/angularjs/2014/10/14/exploring-angular-1.3-one-time-bindings.html" title="AngularJS 1.3 one-time bindings" target="_blank">Angular 1.3 introduced one-time bindings</a>.

{% highlight html %}
<span ng-bind="{{:: 'TRANSLATION_KEY' | translate }}"></span>
{% endhighlight %}

Your intuition would lead you to think that the output from this would be a span tag with the translation inside and question why I'm even here writing this post. Unfortunately, that is not the case if you asynchronously load your localization files, as many large applications do. You may be safe after your application has completed any deferred asset loading, but before then, your first page rendered will likely be missing all its one-time bound translations.

First, let's understand how the filter works. The `translate` filter's <a href="https://github.com/angular-translate/angular-translate/blob/2.7.2/src/filter/translate.js#L65" target="_blank">definition</a> makes use of the **synchronous** lookup function, `$translate.instant`, as a filter is by design synchronous. That means `$translate.instant` is a hit-or-miss lookup, where if the localization is not loaded, it misses and does not return the translation since it doesn't exist. When you use the filter in a binding, it's going to process your string through `$translate.instant`. This works without one-time bindings because your expression is **reevaluated each digest cycle**, and if there's a change, it triggers the watchers to re-render the output. If `$translate.instant('TRANSLATION_KEY')` misses the first time, but hits a successive time, that value will have changed and the new value will be rendered to the view.

When you introduce a one-time binding to the expression, your binding will only exist in the `$$watchers` once, and then you're done. That means you only get one chance to retrieve a data value to bind, and any successive digest loops will not trigger your update if that value changes (in this case, once the localization becomes loaded and returns the final translation value). So if `$translate.instant` misses the first time, that's the final value of your binding. You don't get a second chance to lookup the localization entry again to re render the correct value. It's dependent on the digest cycle.

## How translate-once works

`translate-once` makes use of the link function and the asynchronous resolver of `$translate()`. The directive's <a href="https://github.com/ajwhite/angular-translate-once/blob/v1.0.1/src/translate-once.js#L52-L69" title="Angular one-time binding translate-once source code" target="_blank">link function</a> takes the translation key, looks it up asynchronously with `$translate()`, and once resolved, writes it to the element. Since the link function only fires once, when the element enters context, it is essentially one-time binding the translation. Of course, if it leaves and re-enters context, perhaps with an `ngIf` condition going from `false` and back to `true`.

Let's look at how this works:

{% highlight javascript %}
function linker (scope, element, attrs) {
  var translateValues = {};
  if (attrs.translateValues) {
    translateValues = $parse(attrs.translateValues)(scope);
  }

  $translate(attrs.translateOnce, translateValues).then(function (translation) {
    element.html(translation);
    if (attrs.hasOwnProperty('translateCompile')) {
      $compile(element.contents())(scope);
    }
  });
}
{% endhighlight %}

The first thing that happens is a backward compatible step to ensure we expose existing functionality that `angular-translate` offers -- passing `translate-values` to be used in dynamic localization entries.

{% highlight javascript %}
if (attrs.translateValues) {
  translateValues = $parse(attrs.translateValues)(scope);
}
{% endhighlight %}

We take the `translate-values` attributes, and `$parse` it on the shared scope. Note: the scope is not isolated, it is shared with the context the directive exists in, such that when we parse the values, they are parsed in the scope that the expression exists in.

The second thing that happens is calling `$translate()`. This asynchronously looks up the localization entry, and once it is available, it resolves with the answer if the entry exists.

{% highlight javascript %}
$translate(attrs.translateOnce, translateValues).then(function .. );
{% endhighlight %}


We then take the translation value, and set it to the element's content.

{% highlight javascript %}
var output = translation;
if (attrs.hasOwnProperty('translateCompile')) {
  output = $compile(translation)(scope);
}
element.html(output);
{% endhighlight %}

If the consumer requests that we compile the translation value, as it may contain elements with other bindings, the attribute flag `translate-compile` can be provided and is used in a backward compatible manner. Then we process the translation through `$compile` with the shared scope.

## More one-time binding tools

Just as you may want to set the content of an element to a translation value, many times you may want to do this for other attributes on an element, such as

- An `<input />` element's `value`
- An `<input />` text field `placeholder`
- An `<a />` element's `title` attribute
- An `<img />` element's `alt` attribute
- etc..


A similar process takes place for <a href="https://github.com/ajwhite/angular-translate-once/blob/v1.0.1/src/translate-once.js#L29-L40" title="AngularJS translate-once source code for one-time binding attributes" target="_blank">one-time binding an element's properties</a>. The following attribute directives can be used:

- `translate-once-value`
- `translate-once-placeholder`
- `translate-once-title`
- `translate-once-alt`

The same process takes place as when using `translate-once`, the only difference is that once `$tranlsate()` resolves, it updates the element's corresponding attribute. So if we do `translate-once-placeholder="TRANSLATION_KEY"`, `<input placeholder="translation value" />` will be rendered in the end.

## Contributing
As always, I welcome anyone to contribute a pull request over on the <a href="https://github.com/ajwhite/angular-translate-once" title="translate-once github repository" target="_blank">Github repo</a>. Please make sure that tests are written for any changes or additions made.
