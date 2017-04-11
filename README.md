# mics
### Multiple Inheritance Class System
**Intuitive mixins for ES6 classes**

[![npm](https://img.shields.io/npm/v/mics.svg)](https://npmjs.com/package/mics)
[![license](https://img.shields.io/npm/l/mics.svg)](https://creativecommons.org/licenses/by/4.0/)
[![travis](https://img.shields.io/travis/Download/mics.svg)](https://travis-ci.org/Download/mics)
[![greenkeeper](https://img.shields.io/david/Download/mics.svg)](https://greenkeeper.io/)
![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)

> Multiple Inheritance is like a parachute. You don't often need it, but when you do, you really need it.
*Grady Booch*

## What is it
**mics** *(pronounce: mix)* is a library that makes multiple inheritance in Javascript a 
breeze. Inspired by the excellent blog post ["Real" Mixins with Javascript Classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) 
by Justin Fagnani, **mics** tries to build a minimal library around the concept of using class expressions (factories)
as mixins. **mics** extends the concepts presented in the blog post by making the mixins first-class citizens that can be directly 
used to instantiate objects and can be mixed in with other mixins instead of just with classes.


## Install with NPM
```sh
npm install --save mics
```

## Direct download
* [mics.umd.js](https://cdn.rawgit.com/download/mics/0.1.0/mics.umd.js) (universal module works in browser and node)
* [mics.min.js](https://cdn.rawgit.com/download/mics/0.1.0/mics.min.js) (minified version of universal module file)


## Include in your app

### import
```js
import { mix, is } from 'mics'
```

### require
```js
var mix = require('mics').mix
var is = require('mics').is
```

### AMD
```js
define(['mics'], function(mix){
  var is = mix.is
});
```

### Script tag
```html
<script src="https://cdn.rawgit.com/download/mics/0.1.0/mics.min.js"></script>
```

## Usage
### Creating a mixin
Mixins look a lot like classes, but they are regular ES5 constructor functions, powered by a real
ES6 class. You create them with the `mix` function.

#### mix([superclass] [, ...mixins] [, factory])
`mix` accepts an optional superclass as the first argument, then a bunch of mixins and an optional 
factory as the last argument. If a `superclass` is given, or no `factory` is given, a class is created,
otherwise a mixin. Mostly, you will be using `mix` with a factory to create mixins, like this:

```js
import { mix } from 'mics'

var Looker = mix(superclass => class Looker extends superclass {
  constructor() {
    super()
    console.info('A looker is born!')
  }
  look() {
    console.info('Looking good!')
  }
})
```

Notice that the argument to `mix` is a function that accepts a superclass. You then define the 
body of your mixin as a class that extends `superclass`. The `mix` function wraps that class in
a regular es5 constructor function that you can invoke with new to create instances:

```js
var looker = new Looker()      // > A looker is born!
looker.look()                  // > Looking good!
```

### Testing if an object is (like) a mixin or class
`instanceof` does not work for mixin instances. Instead use **mics**' `is` function, which works on 
mixins (type as well as instance) and on classes (again, type as well as instance).

#### is(subject [, type])
The first parameter to `is` is required and defines the subject to test. The second parameter is optional.
If specified, it calls `a` (see below) and returns a boolean. If not specified, it returns an object that
has submethods `a`/`an` and `as`.

#### a(type)
Tests whether the subject is-a `type`.

```js
import { is } from 'mix'

looker instanceof Looker       // false, but:
is(looker).a(Looker)           // true
```

#### an(type)
For fluidity, `an` is an alias of `a`:

```js
is(animal).an(Elephant)
is(animal).a(Lion)
```

#### as(type)
Often, we don't really care whether the object *is* a certain type, we just want to know whether 
we can treat it *as* a certain type. Use `is(subject).as(type)` to test whether a subject adheres
to the same interface as is defined by `type`:

```js
var viewer = {                 // create an object with the
  look(){}                     // same interface as Looker
}     
is(viewer).a(Looker)           // false, but
is(viewer).as(Looker)          // true
```

A good example of how this might be useful can be found in the new ES6 feature Promises. Here we have
the concept of a 'thenable'. This is any object that has a `then` method on it. Methods in the Promise 
API often accept thenables instead of promise instances. Have a look at `Promise.resolve` for example:

> Promise.resolve(value)
> Returns a Promise object that is resolved with the given value. If the value is a thenable (i.e. 
> has a then method), the returned promise will "follow" that thenable, adopting its eventual state; 
> otherwise the returned promise will be fulfilled with the value.
<sup>[mdn](https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Promise)</sup>

Using `mix` to define an interface and `is..as` to test for it, we can very naturally express the
concept of a thenable from the Promise spec in code:

```js
/** Defines a Thenable */
var Thenable = mix(superclass => class Thenable extends superclass {
  then() {}
})
/** Some mixin which can be treated as a Thenable */
var MyPromise = mix(superclass => class MyPromise extends superclass {
  then(resolve, reject) {
    resolve('Hello, World!')
  }
}
// We can check whether the class is thenable using is..as
is(MyPromise).as(Thenable)    // true 
// we can also check instances
var promise = new MyPromise()
is(promise).as(Thenable)      // true 
// Ok, that means we can use Promise.resolve!
Promise.resolve(promise).then((result) => {
  console.info(result)        // > 'Hello, World!'
})
```

### Mixing mixins into classes
Notice how we are only creating and using mixins up until now. Mixins are more 
flexible than classes so **mics** promotes their use over classes. However, sometimes you are working
with a class and want to mix some mixins into that class. `mix` makes that easy as well. If you
don't pass a factory as the last argument to `mix`, it will use the first argument as the superclass
when available, or create a new superclass automatically and use that to derive from. It will then
return a new class that derives from the superclass adding all the mixins that were passed.

The returned class can be extended from to inherit all the mixins:

```js
class GreatLookingPromise extends mix(Looker, MyPromise) {}
var promise = 
  new GreatLookingPromise()    // > A looker is born!
promise.look()                 // > Looking good!
Promise.resolve(promise).then(
  r => console.info(r)         // > Hello, World!
)
```

When your class needs to extend from a base class, pass it 
as the first argument to `mix`:

```js
class Playboy extends mix(Looker, Talker) {
  talk(){
    console.info('How are *you* doin\'?')
  }
}
class PlayboyPromise extends mix(Playboy, MyPromise) {}
var promise = 
  new PlayboyPromise()         // > A talker is born!
                               // > A looker is born!
promise.look()                 // > Looking good!
promise.talk()                 // > How are *you* doin'?
Promise.resolve(promise).then(
  r => console.info(r)         // > Hello, World!
)
```

> Pro Tip: The constructors returned from `mix` Include a `with` method, that allows
> the `PlayboyPromise` to be declared even simpler:

```js
class PlayboyPromise extends Playboy.with(MyPromise) {
  // ...
}
```

> Pro Tip 2: Cool as `with` is, it will give you a class, which very often means you won't
> be able to mix it further. I recommend sticking to mixins whenever possible as they hardly
> have any downsides compared with regular classes. If you ever need the class, just use
> `SomeMixin.class`, that's the real ES6 class that is used to create instances of the mixin.

### Bonus
As a bonus, you can use `is(..).a(..)` to do some simple type tests by passing a 
string for the type:

```js
function x(){}
class Y {}
is(x).a('function')           // true
is(Y).a('function')           // true
is('Hi').a('function')        // false
is(X).a('class')              // false
is(Y).a('class')              // true
```

Supported type strings: `"mixin"`, `"class"`, `"mix"`, `"factory"`, and any type strings that can be passed to `typeof`.
* mixin: x is a function that is the result of calling `mix` with a class factory
* class: x is an ES6 class
* mix: x is a function that is the result of calling `mix`: could be a class or a mixin
* factory: x is a function that accepts exactly one argument and that is not a mix

## Issues
Add an issue in this project's [issue tracker](https://github.com/download/mics/issues)
to let me know of any problems you find, or questions you may have.

## Copyright
Copyright 2017 by [Stijn de Witt](https://StijnDeWitt.com). Some rights reserved.

## License
Licensed under the [Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/) Open Source license.

