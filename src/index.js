export function mix(...args){
	var superclass = args.length && is(args[0], 'class') && args.shift()
	var factory = args.length && is(args[args.length-1], 'factory') && args.pop()
	// if neither superclass nor factory are provided, create a new superclass
	if (!superclass && !factory) superclass = class{}
	if (superclass) {
		if (!is(superclass, 'mix')) {
			superclass = class extends superclass {}
			Object.defineProperties(superclass, {
				with: {get:() => (...mixins) => mix(superclass, ...mixins)},
				interface: {get:(x => () => x ? x : x = getInterface(superclass.prototype))()}
			})
		}
		return args.length ? args.reduce((c,m) => m(c), superclass) : superclass
	}
	if (args.length) factory = (org => superclass => org(args.reduce((c,m) => m(c), superclass)))(factory)
	function mixin(superclass, ...args) {
		if (this instanceof mixin) return new mixin.class(superclass, ...args)
		var result = is(superclass, mixin) ? superclass : factory(superclass)
		if (mixin.classes.indexOf(result) == -1) mixin.classes.push(result)
		return result
	}
	Object.defineProperties(mixin, {classes: {value:[], writable:false}})
	// has to be 2 steps because mixin adds the created class to mixin.classes
	Object.defineProperties(mixin, {
		mixins: {value:args, writable:false},
		class: {value:mixin(class {}), writable:false},
		with: {get:() => (...mixins) => mix(mixin.class, mixins)},
		interface: {get:(x => () => x ? x : x = getInterface(mixin.class.prototype))()}
	})
	return mixin
}

export default mix

var isFunc = x => typeof x == 'function',
    isClass = x => isFunc(x) && (s => /^class\s/.test(s) || /^.*classCallCheck\(/.test(s.replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'')))(x.toString()),
		isMix = x => isFunc(x) && !!(x.interface && x.with),
		isFactory = x => isFunc(x) && x.length == 1 && !isMix(x),
		isMixin = x => isMix(x) && !isClass(x)

export function is(x, type) {
	function a(type) {
		if (typeof type == 'string') {
			return type == 'factory' ? isFactory(x) :
			       type == 'class' ? isClass(x) :
			       type == 'mixin' ? isMixin(x) :
			       type == 'mix' ? isMix(x) : 
						 typeof x == type;
		}
		if (typeof x == 'object') {
			if (x instanceof type) return true
			if (type.classes) return type.classes.reduce((f,c) => f || a(c), false)
		}
		else if (typeof x == 'function') {
			if (x.mixins && x.mixins.indexOf(type) !== -1) return true
			var c = x
			while (c !== Object) {
				if (c === type) return true
				if (type.classes && type.classes.indexOf(c) !== -1) return true
				c = c.prototype.__proto__.constructor
			}
		}
		return false
	}

	function as(type) {
		if (a(type)) return true
		var itf = type.interface || ((typeof type == 'function') && getInterface(type.prototype))
		var subject = typeof x == 'function' ? x.interface || getInterface(x.prototype) : x
		return itf && Object.keys(itf).reduce((f, k) => 
			f && (typeof itf[k] == 'function' ? typeof subject[k] == 'function' : k in subject), true
		)
	}

	var str = x && x.toString() || ''
	return type !== undefined ? a(type) : {a, an:a, as}
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

