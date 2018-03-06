---
layout: post
title: Exploring ES2015 - Private class methods with Babel
date: 2015-12-24 10:30:00
permalink: /blog/exploring-es2015-private-class-methods-babel
tags: [js, nodejs]
excerpt: Javascript does not support method visibility. There's a few tricks to introduce private methods by determining what you want to export. But when it comes to ES6 classes, we can now create private methods a bit easier.
seo_title: Exploring ES2015 - Private class methods with Babel and ES7
seo_description: Use ES7 Function-Bind syntax to support private functions in ES6/ES2015 classes.
disqus_id: '2015-12-24-exploring-es2015-private-class-methods-babel'
---

Method visibility is not supported by Javascript. There is no way to define a method on a class to be public or private. However we can make use of the <a href="http://babeljs.io/blog/2015/05/14/function-bind/" target="_blank" title="ES7 Function Bind">Function bind syntax</a> to emulate this behavior.

## ES5 private functions

In ES5 we can take advantage of scope to wrap a block of context and only expose a public set of functions, tucking away private information in the scope that the public methods can access. In the example below, we'll have a "counter" which will have a private method to log the updated count, and a set of public mutator methods.

{% highlight javascript %}
var MyClass = (function MyClass () {
  // private
  var count = 0;

  function somePrivateMethod () {
    console.log('count updated', count);
  }

  // public
  return {
    add: function () {
      count++;
      somePrivateMethod()
    },
    subtract: function () {
      count--;
      somePrivateMethod();
    },
    getCount() {
      return count;
    }
  };
})();
{% endhighlight %}

## ES7 private functions

ES2015 classes actually throw a bit of a wrench in this approach. We lose the concept of scope in a `class`. We don't have a block that we can wrap private information and choose which information to make public. We only have a class structure to deal with.

{% highlight javascript %}
class Counter() {
  constructor() {
    this.count = 0;
  },
  add() {
    this.count++;
    this.somePrivateMethod();
  }
  subtract() {
    this.count--;
    this.somePrivateMethod();
  }
  getCount() {
    return this.count
  }
  somePrivateMethod() {
    // not actually private
    console.log('count updated', count);
  }
}
{% endhighlight %}

Any method on the class is accessible from the outside - our private method is unfortunately forced into the public domain with the rest of the class.

### Dumb private functions

We could take out the method from the class, place it outside, and call it by passing the `count`. The downside is that we turn this into a "dumb" function that requires passing in the context, rather than the private function being aware of the context. For example:

{% highlight javascript %}
function somePrivateMethod(count) {
  console.log('count updated', count);
}
class Counter {
  //...
  add() {
    this.count++;
    somePrivateMethod(this.count);
  }
  //...
}
{% endhighlight %}

### Function-Bind

With function-bind, `::`, we can _bind_ the context of the class instance to a function. Rather than passing in the pieces the function has to be made aware of, we can provide it with the entire `this` context, as if it another method on the class itself.

{% highlight javascript %}
class Counter {
  //...
  add() {
    this.count++;
    this::somePrivateMethod();
  }
}

function somePrivateMethod() {
  console.log('count updated', this.count);
}
{% endhighlight %}

The magic here is `this::somePrivateMethod()`, which actually compiles down to `somePrivateMethod.call(this)`. If you are unfamiliar with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call" target="_blank" title="Mozilla Developer Network - Function Call documentation">`Function.prototype.call`</a>, it calls the function and uses the first argument as the function's `this`.

When we do `this::somePrivateMethod`, that takes the left hand argument and uses it for the parameter to `call`, so we end up with `somePrivateMethod.call(this)`.

### Function-bind compiled

Using the <a href="https://babeljs.io/repl/#?experimental=true&evaluate=true&loose=true&spec=false&code=class%20Counter%20%7B%0A%20%20constructor()%20%7B%0A%20%20%20%20this.count%20%3D%200%3B%0A%20%20%7D%0A%20%20add()%20%7B%0A%20%20%20%20this.count%2B%2B%3B%0A%20%20%20%20this%3A%3AsomePrivateMethod()%3B%0A%20%20%7D%0A%7D%0A%0Afunction%20somePrivateMethod()%20%7B%0A%20%20console.log('count%20updated'%2C%20this.count)%3B%0A%7D" target="_blank" title="Babel REPL">Babel REPL</a>, we can see this is true

{% highlight javascript %}
function _classCallCheck(instance, constructor) { ... }
var Counter = (function () {
  function Counter() {
    _classCallCheck(this, Counter);
    this.count = 0;
  }

  Counter.prototype.add = function add() {
    this.count++;
    somePrivateMethod.call(this);
  };

  return Counter;
})();

function somePrivateMethod() {
  console.log('count updated', this.count);
}
{% endhighlight %}

Do note that ES7 capabilities are considered experimental at this time. Babel does not support using these in production yet.
