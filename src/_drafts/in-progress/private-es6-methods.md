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

```js
var PublicInterface = (function () {
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
```

## ES7 private functions

ES2015 classes actually throw a bit of a wrench in this approach. We lose the concept of scope in a `class`.

```js
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
```

Any method on the class is accessible from the outside - our private method is unfortunately forced to be a public method. We could take out the method from the class and call it by passing the `count`, but that requires passing the context to the private function, rather than the private function being aware of the context. For example:

```js
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
```

As seen, we have to always provide the private method with context. It's no longer a private method really, it's more a "dumb" helper who has to be provided with the information.

### Function-Bind

With function-bind, `::`, we can _bind_ the context of the class instance to a function.

```js
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
```

The magic here is `this::somePrivateMethod()`, which actually compiles down to `somePrivateMethod.call(this)`.


Private functions are not supported out of the box.

Example implementation with strawnman syntax

```js
export class Foo {
  publicMethod() {
    this::privateMethod();
  }
}

function privateMethod() {
  //...
}
```
