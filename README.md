# mics <sup><sub>0.6.2</sub></sup>
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
**mics** *(pronounce: mix)* is a library that makes multiple inheritance in Javascript a breeze.
Inspired by the excellent blog post ["Real" Mixins with Javascript Classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)
by Justin Fagnani, **mics** tries to build a minimal library around the concept of using class
expressions (factories) as mixins. **mics** extends the concepts presented in the blog post by
making the mixins first-class citizens that can be directly used to instantiate objects and can
be mixed in with other mixins instead of just with classes.


## Install with NPM
```sh
npm install --save mics
```

## Direct download
* [mics.umd.js](https://cdn.rawgit.com/download/mics/0.6.2/dist/mics.umd.js) (universal module works in browser and node)
* [mics.min.js](https://cdn.rawgit.com/download/mics/0.6.2/dist/mics.min.js) (minified version of universal module file)


## Include in your app

### import
```js
import { mix, is, like } from 'mics'
```

### require
```js
var mix = require('mics').mix
var is = require('mics').is
var like = require('mics').like
```

### AMD
```js
define(['mics'], function(mics){
  var mix = mics.mix
  var is = mics.is
  var like = mics.like
});
```

### Script tag
```html
<script src="https://cdn.rawgit.com/download/mics/0.6.2/dist/mics.min.js"></script>
<script>
  var mix = mics.mix
  var is = mics.is
  var like = mics.like
</script>
```

## Usage
### Creating a mixin
Mixins are like classes on steroids. They look and feel a lot like ES6 classes,
but they have some additional capabilities that ES6 classes do not have:
* They can 'extend' from multiple other mixins including (at most one) ES6 class
* They have an explicit `interface` which can be inspected and tested at runtime
* They *have* an ES6 `class` that is used to create instances
* They have a `mixin` function that mixes in their class body into another type.
* They can be invoked without `new` to create new instances

> **mixin**: An ES5 constructor function that has properties `mixin`, `class` and `interface`.

You create mixins with the `mix` function.

#### mix([superclass] [, ...mixins] [, factory])
`mix` accepts an optional *superclass* as the first argument, then a bunch of *mixin*s 
and an optional *class factory* as the last argument and returns a mixin.

Mostly, you will be using `mix` with a factory to create mixins, like this:

```js
import { mix, is, like } from 'mics'

var Looker = mix(superclass => class Looker extends superclass {
  constructor() {
    super()
    console.info('A looker is born!')
  }
  look() {
    console.info('Looking good!')
  }
})

typeof Looker                 // 'function'
typeof Looker.mixin           // 'function'
typeof Looker.class           // 'function'
typeof Looker.interface       // 'object'
```

Notice that the argument to `mix` is an arrow function that accepts a superclass and 
returns a class that extends the given superclass. The body of the mixin is defined in 
the returned class. We call this a *class factory*.

> **Class factory**: An arrow function that accepts a `superclass` and returns a `class extends superclass`.

The `mix` function creates a mixing function based on the given mixins and the class 
factory and invokes it with the given superclass to create the ES6 class backing the mixin. 
It then creates an ES5 constructor function that uses the ES6 class to create and return 
new instances of the mixin. Finally it constructs the mixin's interface from the class 
prototype and attaches the `mixin` function, the `class` and the `interface` to the ES5 
constructor function, creating what in the context of **mics** we call a mixin.


### Creating instances of mixins
We can directly use the created mixin to create instances, because it is just a constructor function:

```js
var looker = new Looker()     // > A looker is born!
looker.look()                 // > Looking good!
looker instanceof Looker      // true
```

And because it's an ES5 constructor function, we are allowed to invoke it without `new`:

```js
var looker = Looker()         // > A looker is born!
looker.look()                 // > Looking good!
```

> ES6 made newless invocation of constructors throw an error for ES6 classes, because 
> in ES5 it was often a cause for bugs when programmers forgot `new` with constructors 
> that assumed `new` was used. However I (with many others) believe that not using `new` 
> is actually better for writing maintainable code. So mics makes sure that it's 
> constructors work whether you use `new` on them or not, because the backing ES6 class 
> is always invoked with `new` as it should be. Whether you want to write `new` or not 
> in your code is up to you.

### Mixing multiple mixins into a new mixin
Let us define mixins `Walker` and `Talker` to supplement our `Looker`:

```js
var Walker = mix(superclass => class Walker extends superclass {
  walk() {
    console.info('Step, step, step')
  }
})

var Talker = mix(superclass => class Talker extends superclass{
  talk(){
    console.info('Blah, blah, blah')
  }
})
```

Now that we have a bunch of mixins, we can start to use them to achieve multiple inheritance:

```js
var Duck = mix(Looker, Walker, Talker, superclass => class Duck extends superclass {
  talk() {
    var org = super.talk()
    console.info('Quack, quack, quack (Duckian for "' + org + '")')
  }
})

var donald = Duck()
donald.talk()                 // > Quack, quack, quack (Duckian for "Blah, blah, blah")
```

As you can see, we can override methods and use `super` to call the superclass method, 
just like we can with normal ES6 classes.

### Testing if an object is (like) a mixin or class
`instanceof` works for mixin instances like it does for ES6 classes. But, like ES6 
classes, it does not support multiple inheritance. In the example above, `Looker` 
is effectively the superclass for `Duck`. `Walker` and `Talker` are mixed into `Duck` 
by dynamically creating *new* classes and injecting them into the inheritance chain 
between `Looker` and `Duck`. Because these are *new* classes, instances of them are
not recognized by `instanceof` as instances of `Walker` and `Talker`.

Fortunately, **mics** gives us an `is` function, which does understand multiple inheritance.

#### is(subject, type)
Tests whether `subject` is-a `type` or extends from `type`.
The first parameter to `is` defines the subject to test. This can be an instance or 
a type. The second parameter is either a type (constructor function, ES6 class or mixin) 
or a type string.  

```js
duck instanceof Duck          // true
duck instanceof Looker        // true, but:
duck instanceof Walker        // false! mix created a *new class* based on the factory

// `is` to the rescue!
is(duck, Walker)              // true
// we can also test the type
is(Duck, Walker)              // true
is(Talker, Walker)            // false
```

#### like(subject, type)
Often, we don't really care whether the object *is* a certain type, we just want to know 
whether we can treat it *like* a certain type. Use `like(subject, type)` to test whether 
a subject adheres to the same interface as is defined by `type`:

```js
var viewer = {                // create an object with the
  look(){}                    // same interface as Looker
}
is(viewer, Looker)            // false, but
like(viewer, Looker)          // true
```

A good example of how this might be useful can be found in the new ES6 feature Promises. 
Here we have the concept of a 'thenable'. This is any object that has a `then` method on 
it. Methods in the Promise API often accept thenables instead of promise instances. Have 
a look at `Promise.resolve` for example:

> Promise.resolve(value)
> Returns a Promise object that is resolved with the given value. If the value is a 
> thenable (i.e. has a `then` method), the returned promise will "follow" that thenable, 
> adopting its eventual state; otherwise the returned promise will be fulfilled with the value.
<sup>[mdn](https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Promise)</sup>

Using `mix` to define an interface and `like` to test for it, we can very naturally 
express the concept of a thenable from the Promise spec in code:

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
// We can check whether the class is thenable using like
like(MyPromise, Thenable)     // true
// we can also check instances
var promise = new MyPromise()
like(promise, Thenable)       // true
// Ok, that means we can use Promise.resolve!
Promise.resolve(promise).then((result) => {
  console.info(result)        // > 'Hello, World!'
})
```

### Using a custom ES5 constructor
The default constructor returned from `mix` is a one-liner that invokes the ES6 
class with `new`. But there could be reasons to use a different function instead. 
`mix` allows you to supply a custom constructor to be used instead. You do this 
by providing a `static constructor` in the class body:

```js
var Custom = mix(superclass => class Custom extends superclass{
  static constructor(...args){
    console.info('Custom constructor called!')
    return new this(...args)
  }
})

var test = Custom()           // > 'Custom constructor called!'
is(test, Custom)              // true
```

### Bonus
As a bonus, you can use `is()` to do some simple type tests by passing a
string for the type:

```js
class X {}
var factory = superclass => class Y extends superclass {}
var Y = mix(factory)
var Z = mix(X, Y)

is(X, 'function')             // true
is(X, 'class')                // true
is(X, 'mixin')                // false
is(X, 'factory')              // false

is(factory, 'function')       // true
is(factory, 'class')          // false
is(factory, 'mixin')          // false
is(factory, 'factory')        // true

is(Y, 'function')             // true
is(Y, 'class')                // false
is(Y, 'mixin')                // true
is(Y, 'factory')              // false

is(Z, 'function')             // true
is(Z, 'class')                // false
is(Z, 'mixin')                // true
is(Z, 'factory')              // false
```

Supported type strings: `"class"`, `"mixin"`, `"factory"`, and any type strings 
that can be passed to `typeof`.
* class: x is a (possibly Babel-transpiled) ES6 class
* mixin: x is a mixin that is the result of calling `mix`
* factory: x is a class factory function

## Issues
Add an issue in this project's [issue tracker](https://github.com/download/mics/issues)
to let me know of any problems you find, or questions you may have.

## Credits
Credits go to [Justin Fagnani](http://justinfagnani.com) for his excellent blog post ["Real" Mixins with JavaScript Classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) and the accompanying library
[mixwith.js](https://github.com/justinfagnani/mixwith.js).

## Contributors
Many thanks to [Marco Alka](https://marco-alka.de/) for his contributions to this project.

## Copyright
Copyright 2017 by [Stijn de Witt](https://StijnDeWitt.com) and contributors. Some rights reserved.

## License
Licensed under the [Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/) Open Source license.
