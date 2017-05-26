---
layout: post
title: The Current State of State
date: 2017-01-07 12:00:00
permalink: /blog/the-current-state-of-state
tags: [js, react]
---

Today we're going to look at state from a different angle. If you're a developer who's already been using state containers in their applications, you've already been looking at it from this angle. For those of who haven't, I aim to show you a new way to think about the moving parts in your application.

## What is state?

It changes based on who you ask and how narrow or broad you want to think about it.

To me, and to the point of this article, state are the underlying values that become used by your application to perform some logic or output. It could be the "state of the environment" - are you running in Production or Development? It could be the data models, a form field value, or a boolean that indicates whether something on a page should be visible. State is the dynamic part of your application.

Some pieces of state will change over time throughout the course of your application. Changes originate from some source, say a button, where the state will become updated. Generally this button will have a function bound to it, and when called, will change a value in the state. When that value changes, something on the UI may change, or a network request is made, etc.

**How** that value becomes changed and **where** that happens are the important parts.

### Vanilla

With Javascript and HTML alone, we manage:
- Setting up the bindings to receive user inputs/interactions
- Setting up the bindings to update the DOM
- Storing the state (the `count`)
- Functions to update the state (`increment`, `decrement`)

We have a state that lives in a variable. When buttons are clicked, we update that value and rerender the count back to the `span` element.

```html
<span id="count"></span>
<button id="increment">+</button>
<button id="decrement">-</button>
```
```js
// state
var count = 0;

// increment the state
function increment () {
  count = count + 1;
  renderCount();
}

// decrement the state
function decrement () {
  count = count - 1;
  renderCount();
}

// render UI with the next state
function renderCount() {
  document.getElementById('id').innerHTML = count;
}

// update the state, and since the state changed, render UI update
function updateCount(newCount) {
  count = newCount;
  renderCount();
}

// bind button clicks
document.getElementById('increment').addEventListener('click', increment);
document.getElementById('decrement').addEventListener('click', decrement);

// render UI with the initial state
renderCount();
```

### Angular
With Angular we manage much less, just the logic:
- Storing the state
- Functions to update the state

We don't have to manage
- Binding user inputs
- Rendering state outputs
-
```html
{{count}}
<button ng-click="increment()">+</button>
<button ng-click="decrement()">-</button>
```
```js
function CounterCtrl ($scope) {
  // state
  $scope.count = 0;

  // increment the state
  $scope.increment = () => ++$count;

  // decrement the state
  $scope.decrement = () => --$count;
}

angular.component('counter', {
    controller: CounterCtrl
});
```

### React
With React we manage the same thing in a different way

```js
class Counter extends React.Component {
  // state, (obviously ¬_¬)
  state = {
    count: 0
  };

  // increment the state
  increment() {
    var count = this.state.count + 1;
    this.setState({count});
  }

  // decrement the state
  decrement() {
    var count = this.state.count - 1;
    this.setState({count});
  }

  // called whenever state changes
  render() {
    return (
      <div>
        <span>{this.state.count}</span>
        <button onClick={() => this.increment()}>+</button>
        <button onClick={() => this.decrement()}>-</button>
      </div>
    );
  }
}
```

All of these approaches are similar as they all share the same logic. The rest differs in how the framework (or lackthereof) manages receiving user inputs and how it renders state changes back to the DOM.

**One thing they all have in common: they all own and manage their state.**

## The Challenge
<!-- Shared Service -->

Now another part of your application wants to read and write to `count`. The component can't own it anymore, since another component now needs it. Who should it belong to? ComponentA or ComponentB? Maybe we can move it somewhere where **neither own it**, something else owns it, and it shares it with the components.

<!-- For the sake of simplicity and avoiding noise by using frameworks that you, as the reader, may not be familiar with, the examples will be done in plain old vanilla JS. -->

### Vanilla

```js
// CounterService.js
var count = 0;

export function increment() {
  count++;
}

export function decrement() {
  count--;
}

export function getCount() {
  return count;
}
```

```html
<span id="count"></span>
<button id="increment">+</button>
<button id="decrement">-</button>
```
```js
// CounterComponent.js
import * as CounterService from './CounterService';

document.getElementById('increment').addEventListener('click', increment);
document.getElementById('decrement').addEventListener('click', decrement);

function increment() {
  // tell the counter service to increment
  CounterService.increment();

  // render the new count from the service
  renderCount(CustomerService.getCount());
}

function decrement() {
  // tell the counter service to decrement
  CounterService.decrement();

  // render the new count from the service
  renderCount(CustomerService.getCount());
}

function renderCount (count) { ... }
```

### React

Parent responsibility:
- Parent owns and manages state
- Parent provides state to other components
- Parent provides components with a function to change the state

Child responsibility:
- Display provided state
- Invoke provided callbacks to transition the state

```js
class Parent extends React.Component {
  state = {
    count: 0
  };

  increment() {
    var count = this.state.count + 1;
    this.setState({count});
  }

  decrement() {
    var count = this.state.count - 1;
    this.setState({count});
  }

  render() {
    return (
      <div>
        <Counter
          count={this.state.count}
          onIncrement={() => this.increment()}
          onDecrement={() => this.decrement()}
        />
        <SomeOtherUIComponent
          count={this.state.count}
          onChange={count => this.setState({count})}
        />
      </div>
    )
  }
}
```
```js
class Counter extends React.Component {
  render () {
    return (
      <div>
        <span>{this.props.count}</span>
        <button onClick={this.props.onIncrement}>+</button>
        <button onClick={this.props.onDecrement}>-</button>
      </div>
    );
  }
}
```

In all these cases:
- A UI component still manages the state
- State is imperatively managed

The most important change is that components no longer own, nor manage their state. They have two things:
- They are provided with the information (state) to display. It can only read this value, as reassinging `count` would not propagate to where `count` is defined in the parent.
- They are provided with a set of functions that will perform specific changes to the state. The child can only change the state in ways the parent has provided them with - the child component no longer has direct access to the state. It may only communicate through this delegate's callback interface (`onIncrement`, `onDecrement`).


## None of your components should be aware of _how_ to change the state

What if every component in your application looked more like the `Counter` than the `Parent`? That is to say - what if we **removed state management all together from the components**?

This would remove a lot of the enclosed variables and functions that we see moved to the `Parent` from `Counter`, and now we'd get our state from somewhere totally different.

Where should it live instead? How will we tell it to change, and how will we receive changes if something else updated it?

## First, we need to change how we think about state

So far we have been looking at state as values living somewhere that become updated. When we want to increment the count, we just increment it. When we want to decrement it, we take the count and we subtract from it. This is all because we can directly manipulate it since it's within direct reference.

If you're anything like me, this next part will not make sense at first. Up until now state has just been a value. Instead, we're going to think of it as a formula.


This forumula represents every change that happens to your state, no matter what your application is or what your code looks like, changes in state follow this in theory:

```
f(input) = nextState = g(lastState, input)
```

> The `nextState` in an application is equivelant to a function `f`, that when called with an `input`, is equivelant to a function `g` when called with the `lastState` and the `input`.


<!--
Believe it or not, this very principle is the proof for the following.

```js
count = count + 1
```

Before we prove this, let's look at what this seems to do functionally. We expand the formula into a functional code perspective:


```js
var count = 0

const increment = () => f(1)
const decrement = () => f(-1)

function f (input) {
  var prevState = count
  var nextState = g(prevState, input)
  count = nextState
}

function g (prevState, input) {
  return prevState + input
}
```
-->

At first you might think "okay, but what scenarios does this apply to? Surely I don't have to do this for everything, none of my code seems to have anything to do with that formula.". Before we can relate it back to our code, we're going to look at the theory behind it and how it applies to changing state in your application.

**Every state change in your application** can be represented by this formula. It may look fancy on paper, but this formula represents the most basic and common procedure -- changing a value (state):
```js
var count = 0
count = count + 1 // 1
```

When we apply functional principles to our formula we can see it in the following procedure:

`f(input) = nextState = g(prevState, input)`
```js
var count = 0
f(1)
console.log(count) // 1

function f (input) {
  var prevState = count
  var nextState = g(prevState, input)
  count = nextState
}

function g(prevState, input) {
  return prevState + input
}
```

When we do `count = count + 1`, it boils down to the 3 pieces of our formula:

`f(input) = nextState = g(prevState, input)`

- `nextState` is `count` on the **left** side of the assignment
- `prevState` is `count` on the **right** side of the assignment
- `input` is the number `1`
- When we perform `f(1)`, it calls `g` with the `pevState` (`count`) and the `input` (`1`), and produces the `nextState` (`count + 1`)
- `count = f(input) = nextState = g(prevState, input)`
- `f(1) = 1 = g(0, 1)`

<!-- Explain a little more -->

## `f` is an impure function, `g` is a pure function

> A function is pure when every input has a corresponding output and produces no side effects.

In our example we only incremented our counter once.

```js
var count = 0;
f(1)
console.log(count) // 1
```

What if we want to increase `count` to `3`, only incrementing it by `1` at a time?

```js
var count = 0
f(1)
console.log(count) // 1

f(1)
console.log(count) // 2

f(1)
console.log(count) // 3
```

As we call `f` with the same input, yet it produces a different output, we have proved that `f` is not pure. It also both affects and is affected by a variable it does not own or receive as an input - `count`.


### g

`g` works a little differently. This function does not rely on anything but the arguments it is given: the last state and the current input.

In our example, `g` performs the actual logic of incrementing a value by simply adding two numbers together -- the latest count and the amount to increment it by.

Let's look at the affect on `g` from when we called `f(1)` 3 times, starting with a `count` of `0`:
- `1 = g(0, 1)`
- `2 = g(1, 1)`
- `3 = g(2, 1)`

Here we can see that `g` has the responsibility of **transitioning the state.**

### There's more than just `f` and `g`

A few minutes ago `f` and `g` were pieces of an arbitrary formula. Now they are going to reflect two important roles in changing state.

As we've theorized thus far, `f` is an impure, stateful function who has access to the latest value of state, and an input to manipulate that state with.

`g` is a pure, stateless function who simply _produces_, or transitions to a new state based on the last state and the input.


Instead of an imperative assignment
```js
var count = 0
count = count + 1
```

Let's look at this from a functional perspective with our `increment` example. Our first task is to avoid `increment` having to reach out of its immediate scope to read and write `count`.

We could simply pass it in with the amount:

```js
var count = 0

function increment (amount, count) {
  return amount + count
}

count = increment(1, count)
```

Functionally this works fine, `f` is now a pure function. But as we are expanding the formula `f(input) = nextState = g(lastState, input)`, we see that our formula has reduced `f` to only accept one argument.

Instead, we can [curry]() `increment`, such that instead of accepting two arguments, it returns a function that will accep the second argument.

```js
var count = 0

function increment (amount) {
  return function incrementCount (count) {
    return amount + count
  }
}

count = increment(1)(count) // 1
```

`increment`, or `f`, no longer accepts a second argument. Instead the function it returns will inject the state (`count`) into the context, and when called, return the incremented count.

Let's see what this looks like if we write it out a little closer to our formula of

`f(input) = nextState = g(lastState, inpupt)`.

```js
function f(input) {
  return function h(lastState) {
    return g(lastState, input)
  }
}

function g(lastState, input) {
  return lastState + input
}

var lastState = 0;
var input = 1;
var nextState = f(input)(lastState);
```

This is starting to look a bit closer. Now that we've applied this formula to the real world, we see that `prevState` becomes represented by an intermediary function `h`, returned by `f`.

As `prevState` is the result of another function `h()`, our formula becomes:

```
f(input) = nextState = g(h(), input)
```

Now that's interesting, our formula no longer has a "magical value" (`lastState`) that we didn't know where it came from. That magic value was the concept of reaching outside the `increment` function to access `count`. Instead we have curried the function, creating a third function `h`, which produces `lastState`.

We can now think of our formula as 3 distinct pieces, `f`, `g` and `h`.

Such that:
- `h()` impurely produces a `lastState`
- `f(input)` impurely produces a `nextState`
- `g(h(), input)` purely produces a `nextState`


<!--
> Why not just call `f` with the input and the last state?

We could, the formula could be written as `f(input, lastState) = nextState = g(lastState, input)`.

But look at what that does to our increment function:
```js
var count = 0;

function increment (amount, count) {
  count = amount + count;
}
```

Since we already have to write to `count`, and we want to ensure that we're incrementing the proper `count`, we use a reduced form of accepting only the input. This function already directly talks to `count`, so we don't need to pass that in.

That brings us back to our base formula
```
f(input) = nextState = g(lastState, input)
```

And since we introduced `h`, which is what produces `lastState`, we can start to think of this as:
```
f(input) = nextState = g(h(), input)
```
-->

<!--
#### Containerizing `f`

By expanding our increment function to match our formula, we've opened a door. This is an important door - we can break apart the input, the last state, and the function that will produce the next state.

Remember how our components had to hold both the state, and the functions that would manipulate (transition) it? Transforming what was previously a variable assignment into 3 segments means we can define where each piece can live. They don't have to all tightly coupled together in a single function.


**`f` now returns a function that allows us to externally specify what value will be used for `g`, the transition function to operate on.**

That value that we're talking about -- that's the state. We are going to put that in a nice, safe, tucked away part of our application now.

-->

## Redux: State Containers and Reducers



By looking at a simple variable assignment as a formula, we've changed the way we've looked at it by expanding the assignment into a function.

And now we've broken our function into 3 distinct pieces, `f`, `g`, and `h`.
- `f` takes or produces the `input`, which will be used by `g`.
- `f` returns a function `h`, who produces `lastState`, which will be used by `g`
- `g` is called with the `lastState` (from `h`), and `input` (from `f`)
- `g` returns the `nextState`

`f(input) = nextState = g(h(), input)`

Let's isolate each one of these and think about what their roles are:
- `f(input)` is responsible for the **input**
- `h(lastState)` is responsible for the **current state**
- `g(lastState, input)` is responsible for **transitioning the state**


Let's go full circle for a moment.

At first we thought about all of this as `count = count + 1`. Now we're thinking about it as a forumula. And if you haven't lost me yet, next we're going to think of them as individual pieces of an architecture.

The artchitecture is responsible for:
- User inputs
- Current application state
- Transitioning to the next application state



### `f` is an Action
Actions are produced from **input sources**. A [Redux Action]() is an object that defines an intent to change the state. Just like how `increment(1)`, as curried function, didn't actually compute the value yet, the action doesn't do anything on its own either. It has to reach the next stage of the chain.

At this point we've perfomed `f(1)`

```js
function increment (amount = 1) {
  return {
    type: INCREMENT,
    amount
  };
}
```

### `h` is `store.dispatch`

Dispatching an action will call the reducers in the application with the last state and the intended action.

At this point we've performed `f(1)(lastState)`, and if we assume the last state was `0`, then `f(1)(0)`

```js
store.dispatch(increment())
```

### `g` is a Reducer

A reducer is passed in the last state of the application, along with the action that is being performed.

At this point we've called `g`, `g(h(), 1)`, and if we assume the last state was `0`, then, `g(0, 1`).

```js
function counterReducer (lastState, action) {
  switch (action.type) {
    case INCREMENT:
      return lastState + action.amount;
    default:
      return lastState;
  }
}
```

The reducer receives `0` and `{type: INCREMENT, amount: 1}` as arguments.

```js
counterReducer(0, {type: INCREMENT, amount: 1})
```

It hits the supported `case` and returns `lastState + action.amount`, which results in `1`, the next state.

## The Proof

To bring this full picture:

If the current state of the counter is `0`, and we dispatch the `INCREMENT` action,
```js
store.dispatch(increment())
```

Which can be expanded to:
```js
store.dispatch({type: INCREMENT, amount: 1});
```

And with this, our state will become transitioned to `1`.

With the help of Redux, this dispatched action be passed into the reducer, along with the last state:
```js
// store.getState() === 0

var nextState = counterReducer(store.getState(), {type: INCREMENT: amount: 1})

// nextState === 1
```

And thus the state of the counter has transitioned to `1`.

Not convinced we made our proof? Let's look at it a different way.

```js
var input = {type: INCREMENT, amount: 1};
var nextState = 1;

store.dispatch(input) = nextState = counterReducer(store.getState(), input)
```
Which looks a lot like
```
f(input) = nextState = g(h(), input)
```

## Okay, what the flux. You just dispatched my mind.

I hope you're still with me. And if you are, I hope I've changed a how you once saw a simple `count = count + 1` assignment and now see it as a potential software design principle.

First, if you aren't familiar with [Redux](), it works by sending messages from the UI (component) to a "Store", which will call a function that knows how to handle the message, which in turn, will produce a new state. When integrated with a UI library like React, it will become passed to a component as properties, just like our `<Counter />` example.

Let's visualize this.

```js
class Counter extends React.Component {
  render () {
    return (
      <div>
        {this.props.count}
        <button onClick={() => store.dispatch(increment())}>+</button>
        <button onClick={() => store.dispatch(decrement())}>-</button>
    );
  }
}
```
```js
function increment(amount = 1) {
  return {
    type: INCREMENT,
    amount
  }
}

function decrement(amount) {
  return {
    type: DECREMENT,
    amount
  }
}
```
```js
function counterReducer(count = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return count + action.amount;
    case DECREMENT:
      return count - action.amount;
    default:
      return state;
  }
}
```

We won't worry too much about how these the `count` comes back to the `Counter` component, but the idea is that Redux gives you a special component that will wrap your `Counter` just like how we had `Parent` wrap `Counter` earlier; it will provide `Counter` with the state and `dispatch` method.

## What good does splitting these up do?

When we can break down `count = count + 1` into 3 distinct pieces we can architect our application around these principles of how state goes through changes.

- Application inputs -- user interface components, external evens, etc
- A store containing all of the application state
- Functions that will transition the values from the store into their new values in response to certain inputs

> Redux is a "Predictable State Container"

When you can break your application into these 3 pieces, you decouple the sensitive pieces from the rest. How many times have you ran into an issue because one of your functions changed a local variable when it shouldn't have, or that it changed it to something you didn't expect?

These situations are vastly reduced when your click handlers aren't directly modifying the state that your displaying and sharing with other pieces in your app.

The only way the counter can increment or decrement is if our transition function `g` has improper logic. When you have a single function implementing your state logic, you narrow down the things that can touch it to one, single function. You won't have a handful of setters and getters that might race to update a shared value.


### Single source of truth
Multiple components
state lives in a single place
one way to talk to the store

### Predictable state logic
