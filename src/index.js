export { mix, is, like }

function mix(...args) {
	var superclass = !is(args[0], 'factory') && args.shift() || baseclass
	var factory = (is(args[args.length-1], 'factory') && args.pop()) || derive
	superclass = is(superclass, 'mixin') ? superclass.class : derive(superclass)
	if (args.length) factory = (org => superclass => org(args.reduce((s,m) => m.mixin(s), superclass)))(factory)
	function mixin(superclass) {
		var result = is(superclass, mixin) ? superclass : factory(superclass) 
		if (mixin.classes.indexOf(result) === -1) mixin.classes.push(result)
		return result
	}
	Object.defineProperties(mixin, {
		classes: {value:[], writable:false},
		mixins: {value:args, writable:false},
	})
	var Class = mixin(superclass)
	var constructor = Class.hasOwnProperty('constructor') ? Class.constructor.bind(Class) : (...args) => new Class(...args)
	Object.getOwnPropertyNames(Class).forEach(k => Object.defineProperty(constructor, k, {value: Class[k]}))
	return Object.defineProperties(constructor, {
		mixin: {value:mixin, writable:false},
		class: {value: Class, writable:false},
		interface: {get:(x => () => x ? x : x = getInterface(Class.prototype))()},
	})
}

function is(x, type) {
	if (typeof type == 'string') {
		return  type == 'class'   ? is(x, 'function') && (s => /^class\s/.test(s) || /^.*classCallCheck\(/.test(s.replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'')))(x.toString()) :
						type == 'mixin'   ? is(x, 'function') && !!x.mixin :
						type == 'factory' ? is(x, 'function') && !is(x, 'mixin') && !is(x, 'class') && x.length == 1 :
						typeof x == type;
	}
	if (typeof x == 'object') {
		if (x instanceof type) return true
		if (type.class && x instanceof type.class) return true
		if (type.mixin && type.mixin.classes) return type.mixin.classes.reduce((f,c) => f || is(x,c), false)
	}
	else if (typeof x == 'function') {
		if (x.mixin && x.mixin.mixins.indexOf(type) !== -1) return true
		var c = x
		while (c !== Object) {
			if (c === type || c === type.class) return true
			if (type.mixin && type.mixin.classes && type.mixin.classes.indexOf(c) !== -1) return true
			c = c.prototype.__proto__.constructor
		}
	}
	return false
}

function like(x, type) {
	if (is(x, type)) return true
	var itf = type.interface || (is(type, 'function') && getInterface(type.prototype))
	var subject = is(x, 'function') ? x.interface || getInterface(x.prototype) : x
	return itf && Object.keys(itf).reduce((f, k) => 
		f && (is(itf[k], 'function') ? is(subject[k], 'function') : k in subject), true
	)
}

function getInterface(proto) {
	return getPropertyNames(proto).reduce((o,k) => {o[k] = proto[k]; return o}, {})
}

function getPropertyNames(proto) {
	var results = []
	while (proto !== Object.prototype) {
		Object.getOwnPropertyNames(proto).reduce((arr,k) => arr.indexOf(k) === -1 ? arr.push(k) && arr : arr, results)
		proto = proto.__proto__.constructor.prototype
	}
	return results
}

var baseclass = class Object{},
    derive = superclass => ({}[superclass.name || 'Object'] = class extends superclass {})

