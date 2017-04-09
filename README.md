# mics
### Multiple Inheritance Class System
**Intuitive mixins for ES6 classes**


[![npm](https://img.shields.io/npm/v/mics.svg)](https://npmjs.com/package/mics)
[![license](https://img.shields.io/npm/l/mics.svg)](https://creativecommons.org/licenses/by/4.0/)
[![travis](https://img.shields.io/travis/Download/mics.svg)](https://travis-ci.org/Download/mics)
[![greenkeeper](https://img.shields.io/david/Download/mics.svg)](https://greenkeeper.io/)
![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)


## Install with NPM
```sh
npm install --save mics
```

## Direct download
* [mics.umd.js](https://cdn.rawgit.com/download/mics/0.0.1/mics.umd.js) (universal module works in browser and node)
* [mics.min.js](https://cdn.rawgit.com/download/mics/0.0.1/mics.min.js) (minified version of universal module file)


## Include in your app

### require
```js
var mics = require('mics')
```

### import
```js
import mics from 'mics'
```

### AMD
```js
define(['mics'], function(mics){
  // ...
});
```

### Script tag
```html
<script src="https://cdn.rawgit.com/download/mics/0.0.1/mics.min.js"></script>
```

## Usage
### Creating a mixin
Mixins look a lot like classes, but they are regular ES5 constructor functions, powered by a real
ES6 class. You create them with the `mixin` function:

```js
import mics from 'mics'

var Looker = mics(superclass => class Looker extends superclass {
  constructor() {
    super()
    console.info('A looker is born!')
  }
  look() {
    console.info('Looking good!')
  }
})
```

Notice that the argument to `mixin` is a function that accepts a superclass. You then define the 
body of your mixin as a class that extends `superclass`. The `mixin` function wraps that class in
a regular es5 constructor function that you can invoke with new to create instances:

```js
var looker = new Looker()      // > A looker is born!
looker.look()                  // > Looking good!
```

`instanceof` does not work on the instance. Instead use mics' `is` function, with it's 
submethods `a`/`an` and `as`, like this:

```js
import { is } from 'mics'

looker instanceof Looker       // false, but:
looker instanceof Looker.class // true, and (better):
is(looker).a(Looker)           // true
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

For fluidity, `an` is an alias of `a`:

```js
is(animal).an(Elephant)
is(animal).a(Lion)
```

Now let us make some more mixins:

```js
var Walker = mixin(superclass => class Walker extends superclass {
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

var Talker = mixin(superclass => class Talker extends superclass {
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

var Duck = mics(Looker, Walker, Talker, superclass => class Duck extends superclass {
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

class Duckish extends mics(Looker, Walker, Talker) {
  talk() {
    console.info('I talk like a duck')
  }
}

var duckish = new Duckish()
is(duskish).as(Duck)          // true
```

## Issues
Add an issue in this project's [issue tracker](https://github.com/download/mics/issues)
to let me know of any problems you find, or questions you may have.

## Copyright
Copyright 2017 by [Stijn de Witt](https://StijnDeWitt.com). Some rights reserved.

## License
Licensed under the [Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/) Open Source license.

