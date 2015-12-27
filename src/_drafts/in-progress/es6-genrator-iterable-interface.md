When I first heard of ES6 (or rather, ES2015) generators, it took me a couple cycles of reading to understand the idea behind them. Once you have that "ah Ha!" moment, you can see all the things you could potentially do with them. I always it helpful to relate something new to something you already understand, so let's see how we can use generators to solve problems that we face today.

## What is a generator?
A generator is basically a function with a different type of `return`. Instead of returning values, it _produces_, or _yeilds_ a value whenever `next()` is called. A generator's code block runs until the first `yield` line. That line only gets executed when `next()` is called. When `next()` is called, whatever value is yielded is given to next and the code continues to run until the next `yeild` is reached, or otherwise completes. When you call a generator, it returns you an _instance_ of the generator, similar to how you might call `new FunctionName()`.

For example, this will `yield` two values, `a` and then `b`, and then it will be done:
{% highlight javascript %}
```
function* example() {
  yield 'a';
  yield 'b';
}

var instance = example();
console.log(instance.next()) // {value: 'a', done: false}
console.log(instance.next()) // {value: 'b', done: false}
console.log(instance.next()) // {value: undefined, done: true}
```
{% endhighlight %}

In other examples, you can `yield` inside a loop. In the example below, we have a generator that produces an identifier. Since the `yield` lives in an infinite loop, it will always produce a `next()` value.

{% highlight javascript%}
```
function* idGenerator() {
  var id = 0;
  while (true) {
    yield ++id;
  }
}
```
{% endhighlight %}

There's 2 important things to recognize about how this is written, and one important thing to understand.

1. We define a generator with a `*`, `function*`
2. We `yield` the result, this will be returned whenever we call `next()` on the generator. This is like `return`, except a generator doesn't exactly return a value when you call it, it returns a "new" instance of the generator, which we will describe in 3.
3. The scope of the generator, where `id` starts at `0`, is retained and doesn't "end". If this were a typical function, we'd get the next value up from `0`, which would be `1`. The next time we call it, we'd get the same thing, since `id` is initialized inside the scope of the function.

I want us to understand point 3. When you create a generator, it returns to you an _instance_ of that generator, which will retain the scope. Let's look at how this will behave:

{% highlight javascript%}
```
var generatorInstance = idGenerator();
console.log(generatorInstance.next()) // {value: 1, done: false}
console.log(generatorInstance.next()) // {value: 2, done: false}
console.log(generatorInstance.next()) // {value: 3, done: false}
// to infinity and beyond
```
{% endhighlight %}



## Creating an interable interface to an array.

In other languages, such as Java, lists can generate iterable interfaces, such as, `(List) myList.iterator()`. With ES6, we can do the same thing.

{% highlight javascript%}
```
function* iterable(list) {
  var index = 0;
  while (index < list.length) {
    return list[index++];
  }
}
```
{% endhighlight %}

This will provide a similar iterator interface that you'd expect from other languages.

{% highlight javascript%}
var list = ['a', 'b', 'c', 'd', 'e'];
var iterator = iterable(list);

var item;
while (!(item = iterator.next()).done) {
  console.log(item.value);
}
{% endhighlight %}

This example is used from <a href="https://github.com/ajwhite/iterator-generator" target="_blank" title="Iterator Generator">iterator-generator</a>.
