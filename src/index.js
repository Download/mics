var baseclass = class Object{}
var derive = superclass => ({}[superclass.name || 'Object'] = class extends superclass {})

export function mix(...args){
	var superclass = !is(args[0]).a('factory') && args.shift() || baseclass
	var factory = (is(args[args.length-1]).a('factory') && args.pop()) || derive
	if (!is(superclass, 'mix')) {
		superclass = derive(superclass)
		Object.defineProperties(superclass, {
			interface: {value:getInterface(superclass.prototype), writable:false}
		})
	}
	if (args.length) factory = (org => superclass => org(args.reduce((s,m) => m.mixin(s), superclass)))(factory)
	function mixin(superclass) {
		var result = is(superclass).a(mixin) ? superclass : factory(superclass) 
		if (mixin.classes.indexOf(result) == -1) mixin.classes.push(result)
		return result
	}
	Object.defineProperties(mixin, {
		classes: {value:[], writable:false},
		mixins: {value:args, writable:false},
	})
	var constructor = mixin(superclass)
	return Object.defineProperties(constructor, {
		mixin: {value:mixin, writable:false},
		interface: {get:(x => () => x ? x : x = getInterface(constructor.prototype))()},
	})
}

export default mix

export function is(x, type) {
	function a(type) {
		if (typeof type == 'string') {
			return type == 'mixin' ? typeof x == 'function' && !!x.mixin :
			       type == 'mix' ? typeof x == 'function' && !!x.interface : 
			       type == 'factory' ? typeof x == 'function' && x.length == 1 && !x.interface :
						 typeof x == type;
		}
		if (typeof x == 'object') {
			if (x instanceof type) return true
			if (type.classes) return type.classes.reduce((f,c) => f || a(c), false)
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

	function as(type) {
		if (a(type)) return true
		var itf = type.interface || (is(type, 'function') && getInterface(type.prototype))
		var subject = is(x, 'function') ? x.interface || getInterface(x.prototype) : x
		return itf && Object.keys(itf).reduce((f, k) => 
			f && (is(itf[k], 'function') ? is(subject[k], 'function') : k in subject), true
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

function getInterface(proto) {
	return getPropertyNames(proto).reduce((o,k) => {o[k] = proto[k]; return o}, {})
}
