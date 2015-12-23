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
