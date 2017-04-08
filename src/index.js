

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

export default mix

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

function isNativeClass (value) {
	return typeof value === 'function' && value.toString().indexOf('class') === 0
}