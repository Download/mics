# mics
### Multiple Inheritance Class System
**Intuitive mixins for ES6 classes**

> Multiple Inheritance is like a parachute. You don't often need it, but when you do, you really need it.
*Grady Booch*

[![npm](https://img.shields.io/npm/v/mics.svg)](https://npmjs.com/package/mics)
[![license](https://img.shields.io/npm/l/mics.svg)](https://creativecommons.org/licenses/by/4.0/)
[![travis](https://img.shields.io/travis/Download/mics.svg)](https://travis-ci.org/Download/mics)
[![greenkeeper](https://img.shields.io/david/Download/mics.svg)](https://greenkeeper.io/)
![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)

## What is it
Mics *(pronounce: mix)* is a library that makes multiple inheritance in Javascript a 
breeze. Inspired by the excellent blog post ["Real" Mixins with Javascript Classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) 
by Justin Fagnani, mics tries to build a minimal library around the concept of using class expressions (factories)
as mixins. Mics extends the concepts presented in the blog post by making the mixins first-class citizens that can be directly 
used to instantiate objects and can be mixed in with other mixins instead of just with classes.


## Install with NPM
```sh
npm install --save mics
```

## Direct download
* [mics.umd.js](https://cdn.rawgit.com/download/mics/0.1.0/mics.umd.js) (universal module works in browser and node)
* [mics.min.js](https://cdn.rawgit.com/download/mics/0.1.0/mics.min.js) (minified version of universal module file)


## Include in your app

### require
```js
var mix = require('mics').mix
var is = require('mics').is
// or, shorthand
var mix = require('mics')
```

### import
```js
import { mix, is } from 'mics'
// or, shorthand
import mix from 'mics'
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
ES6 class. You create them with the `mix` function:

```js
import mix from 'mics'

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

`instanceof` does not work on the instance. Instead use mics' `is` function, with it's 
submethods `a`/`an` and `as`, like this:

```js
import { is } from 'mix'

looker instanceof Looker       // false, but:
is(looker).a(Looker)           // true
```

For fluidity, `an` is an alias of `a`:

```js
is(animal).an(Elephant)
is(animal).a(Lion)
```

Often, we don't really care whether the object *is* a certain type, we just want to know whether 
we can treat is *as* a certain type. Use `is(subject).as(type)` to test whether a subject adheres
to the same interface as is defined by `type`:

```js
var viewer = {                 // create an object with the
  look(){}                     // same interface as Looker
}     
is(viewer).a(Looker)           // false, but
is(viewer).as(Looker)          // true
```

Now let us make some more mixins:

```js
var Walker = mix(superclass => class Walker extends superclass {
  constructor() {
    super()
    console.info('A walker is born!')
  }
  walk() {
    console.info('Step step step...')
  }
})

var walker = new Walker()    // > A walker is born!
walker.walk()                // > Step step step...

var Talker = mix(superclass => class Talker extends superclass {
  constructor() {
    super()
    console.info('A talker is born!')
  }
  talk() {
    console.info('Blah blah blah...')
  }
})

var talker = new Talker()    // > A talker is born!
talker.talk()                // > Blah blah blah...

var Duck = mix(Looker, Walker, Talker, superclass => class Duck extends superclass {
  constructor() {
    super()
    console.info('A duck is born!')
  }
  talk() {
    console.info('Quack quack...')
  }
})

var duck = new Duck()        // > A swimmer is born!
                             // > A walker is born!
                             // > A talker is born!
                             // > A duck is born!
talker.talk()                // > Quack quack...
is(talker).a.(Duck)          // true
is(talker).a(Walker)         // true

class Duckish extends mix(Looker, Walker, Talker) {
  talk() {
    console.info('I look, walk and talk like a duck!')
  }
}

var duckish = new Duckish()
is(duckish).as(Duck)          // true
```

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

