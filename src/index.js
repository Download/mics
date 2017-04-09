export function mics(...args){
	var superclass = args.length && typeof args[0] == 'function' && isClass(args[0]) && args.shift()
	var factory = args.length && typeof args[args.length-1] == 'function' && args[args.length-1].length == 1 && !isMics(args[args.length-1]) && args.pop()
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

export default mics

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
	return type !== undefined ? a(type) : { a, an:a, as }
}

function getPropertyNames(proto) {
	var results = []
	while (proto !== Object.prototype) {
		Object.getOwnPropertyNames(proto).reduce((arr,k) => arr.indexOf(k) === -1 ? arr.push(k) && arr : arr, results)
		proto = proto.__proto__.constructor.prototype
	}
	return results
}

export function getInterface(proto) {
	return getPropertyNames(proto).reduce((o,k) => {o[k] = proto[k]; return o}, {})
}

export const isClass = x => x.toString().indexOf('class') === 0
export const isMics = x => !!(x.interface && x.with)
