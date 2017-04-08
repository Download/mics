

// should combine `mix` and `mixin`
// * no arguments: creates a new base class that has a `with` method to mix in other mics later
// * `superclass` argument: 
//    - optional, if supplied it must be a ES6 class
//    - if the superclass is a `type` (has an `interface` property), return the superclass (extended by the given mixins if any)
//    - if superclass is not a `type`, create a derived class from it, add an `interface` property and return the derived class (extended by the given mixins if any)
// * optional es6 class as first argument
//   --> if supplied, return an ES6 class, otherwise a mixin
// * optional 0..n mixins
//   --> will be mixed into resulting class/mixin
// * optional class factory as last argument
//   --> will be last in prototype chain
//
// should accept either an es6 class + optional mics
// or optional mics and an optional class factory
// when invoked with a single mics, return it unchanges
// 
// var MixinA = mics(superclass => class MixinA extends superclass {
//   a(){}
// })
// 
// var MixinB = mics(superclass => class MixinB extends superclass {
//   b(){}
// })
// 
// class Mixed extends mics(MixinA, MixinB, )

export function mics(...args){
	var superclass = args.length && isFunction(args[0]) && isClass(args[0]) && args.shift()
	var factory = args.length && isFunction(args[args.length-1]) && !isMics(args[args.length-1]) && isFactory(args[args.length-1]) && args.pop()
	// if neither superclass nor factory are provided, create a new superclass
	if (!superclass && !factory) superclass = class{}
	if (superclass) {
		if (!isMics(superclass)) {
			superclass = class extends superclass {}
			Object.defineProperties(superclass, {
				with: {get:() => (...mixins) => mixins.reduce((c,m) => m(c), superclass)},
				interface: {get:(x => () => x ? x : x = getInterface(superclass.prototype))()}
			})
		}
		return args.length ? superclass.with(args) : superclass
	}

	if (args.length) factory = (org => superclass => org(args.reduce((c,m) => m(c), superclass)))(factory)
	function mixin(superclass, ...args) {
		if (this instanceof mixin) return new mixin.class(superclass, ...args)
		var result = is(superclass).a(mixin) ? superclass : factory(superclass)
		if (mixin.classes.indexOf(result) == -1) mixin.classes.push(result)
		return result
	}
	Object.defineProperties(mixin, {classes: {value:[], writable:false}})
	// has to be 2 steps because mixin adds the created class to mixin.classes
	Object.defineProperties(mixin, {
		class: {value:mixin(class {}), writable:false},
		with: {get:() => (...mixins) => mics(mixin.class, mixins)},
		interface: {get:(x => () => x ? x : x = getInterface(mixin.class.prototype))()}
	})
	return mixin
}

export function mix(superclass, ...mixins) {
	if (! superclass) superclass = class{}
	if (! superclass.with) {
		superclass = class extends superclass {}
		Object.defineProperties(superclass, {
			with: {get:() => (...mixins) => mixins.reduce((c,m) => m(c), superclass)},
			interface: {value:getInterface(superclass.prototype), writable:false}
		})
	}
	return mixins.length ? superclass.with(mixins) : superclass
}

export function mixin(fn) {
	function mixin(superclass, ...args) {
		if (this instanceof mixin) {
			console.info('invocation of mixin with new')
			var result = new mixin.class(superclass, ...args)
			console.info('result: ', result)
			return result
		}
		var result = is(superclass, mixin) ? superclass : fn(superclass)
		if (mixin.classes.indexOf(result) == -1) mixin.classes.push(result)
		return result
	}
	mixin.classes = []
	mixin.class = mixin(class {})
	mixin.interface = getInterface(mixin.class.prototype)
	return mixin
}

export function is(obj, type) {
	function a(type) {
		if (typeof obj == 'object') {
			if (obj instanceof type) return true
			if (type.classes) return type.classes.reduce((f,c) => f || a(c), false)
		}
		else if (typeof obj == 'function') {
			var c = obj
			while (c !== Object) {
				if (c === type) return true
				if (type.classes && type.classes.indexOf(c) !== -1) return true
				c = c.prototype.__proto__.constructor
			}
		}
		return false
	}
	function as(type)	{
		if (a(type)) return true
		var itf = type.interface || ((typeof type == 'function') && getInterface(type.prototype))
		var subject = typeof obj == 'function' ? obj.interface || getInterface(obj.prototype) : obj
		return itf && Object.keys(itf).reduce((f, k) => 
			f && (typeof itf[k] == 'function' ? typeof subject[k] == 'function' : k in subject), true
		)
	}
	return type !== undefined ? a(type) : { a, as }
}

function getInterface(proto) {
	return Object.getOwnPropertyNames(proto).reduce((o,k) => {o[k] = proto[k]; return o}, {})
}

var isFunction = x => typeof x == 'function'
var isClass = x => x.toString().indexOf('class') === 0
var isMics = x => !!(x.interface && x.with)
var isFactory = x => x.length === 1
