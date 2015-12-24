---
layout: post
title: ES2015 Private class methods
date: 2015-12-24 10:30:00
permalink: /blog/es2015-private-classes
tags: [javascript]
excerpt: Javascript does not support method visibility. There's a few tricks to introduce private methods by determining what you want to export. But when it comes to ES6 classes, we can now create private methods a bit easier.
---

If you don't already know, method visibility is not supported by Javascript. There is no way to define a method on a class to be public or private. However we can make use of the <a href="http://babeljs.io/blog/2015/05/14/function-bind/" target="_blank" title="ES7 Function Bind">Function bind syntax</a>.

## ES5 private functions

In ES5 we can take advantage of scope to wrap a block of context and only expose a public set of functions, tucking away private information in the scope that the public methods can access. In the example below, we'll have a "counter" which will have a private method to log the updated count.

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

ES2015 classes actually throw a bit of a wrench in this approach. We lose the concept of scope in a `class`.

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

Any method on the class is accessible from the outside - our private method is unfortunately forced to be a public method. We could take out the method from the class and call it by passing the `count`, but that requires passing the context to the private function, rather than the private function being aware of the context. For example:

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

As seen, we have to always provide the private method with context. It's no longer a private method really, it's more a "dumb" helper who has to be provided with the information.

### Function-Bind

With function-bind, `::`, we can _bind_ the context of the class instance to a function.

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
