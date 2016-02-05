---
layout: post
title: renderIf - Conditionally render React components
date: 2015-12-27 14:10:00
permalink: /blog/render-if-conditionally-render-react-components
project: https://github.com/ajwhite/render-if
tags: [react, js, nodejs]
excerpt: A lightweight curry function used to conditionally render React components cleanly as a familiar control flow.
seo_title: renderIf - Conditionally render React components
seo_description: Conditionally render React and React Native components without an ugly if-else control flow.
disqus_id: '22016-02-04-render-if-conditionally-render-react-components'
---

One of the first questions nearly everyone asks when they first start using React is "How do I conditionally render an element?". Any time a React element is part of a `render` body, it will be evaluated and rendered. Unlike Angular's `ng-if`, there is no attribute that can prevent an element from being rendered.

This is where <a href="https://github.com/ajwhite/render-if" target="_blank" title="RenderIf - Conditionally render React components">render-if</a> comes in.

## As an in-line condition
{% highlight js %}
render() {
  return (
    {renderIf(1 + 2 === 3)(
      <span>Hello World!</span>
    )}
  );
}
{% endhighlight %}

## As a named conditional function
{% highlight js %}
render() {
  const ifUniverseIsWorking = renderIf(1 + 2 === 3)
  return (
    {ifUniverseIsWorking(
      <span>Everything is okay in the world</span>
    )}
  );
}
{% endhighlight %}

## As a composed conditional function
{% highlight js %}
const ifEven = count => renderIf(count % 2 === 0);
const ifOdd = count => renderIf(count % 2 !== 0);
render() {
  return (
    {ifEven(this.props.count)(
      <span>{this.props.count} is an even number!</span>
    )}
    {ifOdd(this.props.count) {
      <span>{this.props.count} is an odd number!</span>
    }}
  );
}
{% endhighlight %}

## Conditionals don't work so well in React

If you're reading this, good chances are that you already know the problem conditional UI components presents in React. I've generally seen three approaches.

1. Lazy evaluation
2. Variable assignment
3. Function encapsulation

### Lazy evaluation

In Javascript, and many other languages, boolean expressions are evaluated from left to right until the expression can be determined and it won't go farther than it needs to. This is also known as <a href="https://en.wikipedia.org/wiki/Short-circuit_evaluation" target="_blank" title="Short Circuit evaluation">short circuit evaluation</a>.

When `if (true || false)` is evaluated, it knows that _either_ of the conditions are needed to satisfy the expression. When reading from left to right, `true` is the first evaluation. Since this is an `OR` expression, we need not to go farther.

In the case of `if (false && true)`, the same idea applies. Since this is an `AND` expression, both conditions must be `true`. The first value evaluated is `false`, so we know that the following value won't change the outcome of the expression and is not evaluated.

Lastly, in the case of javascript, when you have an expression `var result = true && 'foobar'`, you actually don't get a boolean back, you get the final value in the expression, `foobar`. This allows us to use the second value in our expression as the "return" object, which we can take advantage of in JSX:

{% highlight js %}
class MyComponent extends Component {
  render() {
    return (
      <div>
      {1 + 2 == 3 && <span>I show up only when the left hand is true</span>}
      </div>
    );
  }
}
{% endhighlight %}

### The variable

This is a pretty common one. A variable is used to hold the element, and the variable assignment is based on a condition. You'll see this most frequently when you're dealing with an `if-else` scenario.

{% highlight js %}
class MyComponent extends Component {
  render() {
    var component;
    if (1 + 2 === 3) {
      component = <span>I show up only when this condition is true</span>
    } else {
      component = <span>I show up when the condition is false</span>
    }
    return (
      {component}
    );
  }
}
{% endhighlight %}

### The function

This is also a common one. You'll see this when there's a lot of conditional UI components that would bloat the `render` function, or if the logic is complex and is better contained separately.

{% highlight js %}
class MyComponent extends Component {
  render() {
    return (
      {this.renderConditionalComponent()}
    )
  }
  renderConditionalComponent() {
    if (1 + 2 === 3) {
      return <span>I only show up when this condition is true</span>
    } else {
      return <span>I only show up when this condition is false</span>
    }
  }
}
{% endhighlight %}

All of these are valid approaches to conditional UI components. Each one can be more beneficial than the other depending on the scenario.

## RenderIf

`render-if` takes a different approach. A lot of people when they first start off might be tempted to treat JSX like liquid templates control flow tags:

{% highlight js %}
render() {
  return (
    {if (1 + 2 === 3)}
      <span>This doesn't work</span>
    {endif}
  );
}
{% endhighlight %}

Unfortunately, or rather fortunately, you've found that it doesn't work this way. With `render-if`, we can achieve a syntatically similar and valid approach.

{% highlight js %}
render() {
  return (
    {renderIf(1 + 2 === 3)(
      <span>This works!</span>
    )}
  );
}
{% endhighlight %}

`render-if` is a curry function. Meaning it's a function that returns a function based on the context provided by the original function call. `renderIf(predicate)(element)`. If the `predicate` is `true`, the `element` passed into the second call is returned. If the `predicate` is `false`, the `element` is not returned.

It's as simple as that.

{% highlight js %}
const renderIf = predicate => element => predicate && element;
{% endhighlight %}

This affords us the ability to do two things. As seen in the example above, we can structure our `renderIf` very similar to an `if` statement, just without curly brackets `{ }`. It also allows us to compose named conditional render functions.

### Conditions as functions

Having a curry function allows us to compose functions representing our conditions. It's easiest to understand this by looking at an example:

{% highlight js %}
render() {
  const ifUniverseIsWorking = renderIf(1 + 2 === 3);
  const ifUniverseIsNotWorking = renderIf(1 + 2 !== 3);

  return (
    <div>
    {ifUniverseIsWorking(
      <span>All is well in the world</span>
    )}
    {ifUniverseIsNotWorking(
      <span>Something is terribly wrong</span>
    )}
    </div>
  );
}
{% endhighlight %}

This is where things get a bit nicer and fall a bit closer to the React tree. We're used to being able to easily render collections, like `{collection.map((value, index) => <span key={index}>{value}</span>)}`. However we don't have a nice way to do this with conditions. Until now.

## Putting it all together

Let's take a look at what a real React component might look like with `render-if`.

{% highlight js %}
class OddsEvens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1
    };
  }
  increment() {
    this.state.count++;
    this.setState(this.state);
  }
  render() {
    const isEven = renderIf(this.state.count % 2 === 0)
    const isOdd = renderIf(this.state.count % 2 !== 0)
    return (
      <div>
        <div>
          <span>Count: {this.state.count}</span>
          {isEven(
            <span>It's even</span>
          )}
          {isOdd(
            <span>It's odd</span>
          )}
        </div>
        <button onClick={() => this.increment()}>Increment</button>
      </div>
    );
  }
}
{% endhighlight %}

It's also very composable. Say we don't want to put `const` in the `render` method, but rather define it outside the class and call it as a function providing the value to evaluate in the condition.


{% highlight js %}
const isEven = count => renderIf(count % 2 === 0)
const isOdd = count => renderIf(count % 2 !== 0)

class OddsEvens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1
    };
  }
  increment() {
    this.state.count++;
    this.setState(this.state);
  }
  render() {
    return (
      <div>
        <div>
          <span>Count: {this.state.count}</span>
          {isEven(this.state.count)(
            <span>It's even</span>
          )}
          {isOdd(this.state.count)(
            <span>It's odd</span>
          )}
        </div>
        <button onClick={() => this.increment()}>Increment</button>
      </div>
    );
  }
}
{% endhighlight %}

You can find this project <a href="https://github.com/ajwhite/render-if" target="_blank" title="RenderIf - Conditionally render React components">on Github</a>.
