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
var mix = require('mics').mix
var mixin = require('mics').mixin
var is = require('mics').is
```

### import
```js
import { mix, mixin, is } from 'mics'
```

### AMD
```js
define(['mics'], function(mics){
  var { mix, mixin, is } = mics
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
import { mixin } from 'mics'

var Swimmer = mixin(superclass => class Swimmer extends superclass {
  constructor() {
    super()
    console.info('A swimmer is born!')
  }
  swim() {
    console.info('Splash splash!')
  }
})
```

Notice that the argument to `mixin` is a function that accepts a superclass. You then define the 
body of your mixin as a class that extends `superclass`. The `mixin` function wraps that class in
a regular es5 constructor function that you can invoke with new to create instances:

```js
var swimmer = new Swimmer()  // > A swimmer is born!
swimmer.swim()               // > Splash splash!
```

`instanceof` does not work on the instance. Instead use mics' `is` function, with it's 
submethods `a` and `as`, like this:

```js
import { is } from 'mics'

is(swimmer).a(Swimmer)       // true
var canSwim = {              // create an object with the
  swim(){}                   // same interface as Swimmer
}     
is(canSwim).a(Swimmer)       // false, but
is(canSwim).as(Swimmer)      // true
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

class Duck extends mix().with(Swimmer, Walker, Talker) {
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
is({walk()}).as(Walker)      // true 



var 
var results = bridalapp.products.search()
bridalapp.log.info('Found ' + results.total + ' results.')

var supplier = new Supplier().setName('Test Supplier)
supplier = bridalapp.suppliers.create(supplier);
bridalapp.log.info('Created supplier ' + supplier.name + ' with ID ' + supplier.id)

## Issues
Add an issue in this project's [issue tracker](https://github.com/download/bridalapp-client-js/issues)
to let me know of any problems you find, or questions you may have.

## Copyright
Copyright 2017 by [Stijn de Witt](https://StijnDeWitt.com). Some rights reserved.

## License
Licensed under the [Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/) Open Source license.

