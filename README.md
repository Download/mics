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
as mixins. **mics** extends the concepts presented in the blog post by making the mixins first-class (literally!) citizens 
that can be directly used to instantiate objects and can be mixed in with other mixins instead of just with classes.


## Install with NPM
```sh
npm install --save mics
```

## Direct download
* [mics.umd.js](https://cdn.rawgit.com/download/mics/0.4.0/dist/mics.umd.js) (universal module works in browser and node)
* [mics.min.js](https://cdn.rawgit.com/download/mics/0.4.0/dist/mics.min.js) (minified version of universal module file)


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
<script src="https://cdn.rawgit.com/download/mics/0.4.0/dist/mics.min.js"></script>
```

## Usage
### Creating a mixin
Mixins are normal ES6 classes that have two class properties: `mixin` and `interface`. 
You create them with the `mix` function.

#### mix([superclass] [, ...mixins] [, factory])
`mix` accepts an optional superclass as the first argument, then a bunch of mixins and an optional 
factory as the last argument. If no `factory` is given, a regular class is created, otherwise a 
mixin class. In both cases, the result of the call will be an ES6 class.

Mostly, you will be using `mix` with a factory to create mixins, like this:

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

Notice that the argument to `mix` is an arrow function that accepts a superclass and returns a class 
that extends the given superclass. The body of the mixin is defined in the returned class. We call this 
a *class factory*. The `mix` function creates a mixing function based on the given mixins and the class 
factory and uses it to create the resulting class. It then attaches the mixing function to the resulting 
class (under the key `mixin`), creating what in the context of **mics** we call a mixin. We can directly
use that mixin to create instances, because it is just a class:

```js
var looker = new Looker()      // > A looker is born!
looker.look()                  // > Looking good!
looker instanceof Looker       // true
typeof looker.mixin            // function
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

looker instanceof Looker       // true, but:
var GoodLooker = mix(Looker, superclass => class GoodLooker extends superclass {})
var hottie = new GoodLooker()
hottie instanceof Looker       // false! mix created a *new class* based on the factory

// is..a to the rescue!
is(hottie).a(Looker)           // true
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

### Bonus
As a bonus, you can use `is(..).a(..)` to do some simple type tests by passing a 
string for the type:

```js
class X {}
var Y = mix(superclass => class Y extends superclass {})
var Z = mix(X, Y)
is(X).a('function')           // true
is(X).a('mix')                // false
is(Y).a('function')           // true
is(Y).a('mix')                // true
is(Y).a('mixin')              // true
is(Z).a('function')           // true
is(Z).a('mix')                // true
is(Z).a('mixin')              // false
```

Supported type strings: `"mix"`, `"mixin"`, `"factory"`, and any type strings that can be passed to `typeof`.
* mix: x is a class that is the result of calling `mix`: could be mixin
* mixin: x is a class that is the result of calling `mix` with a class factory
* factory: x is a class factory function

## Issues
Add an issue in this project's [issue tracker](https://github.com/download/mics/issues)
to let me know of any problems you find, or questions you may have.

## Copyright
Copyright 2017 by [Stijn de Witt](https://StijnDeWitt.com). Some rights reserved.

## License
Licensed under the [Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/) Open Source license.

