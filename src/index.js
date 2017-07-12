export { mix, is, like }

/**
 * Accepts an optional superclass as the first argument,
 * then a bunch of mixins and an optional class factory as the last argument and returns a mixin.
 * Mostly, you will be using mix with a factory to create mixins, like this:
 *
 * var Looker = mix(superclass => class Looker extends superclass {
 *   constructor() {
 *     super()
 *     console.info('A looker is born!')
 *   }
 *   look() {
 *     console.info('Looking good!')
 *   }
 * })
 *
 * @param {function} args
 *   Consists of the following three argument groups:
 *   {function} superclass (optional)
 *   {function} mixins... (0 or more)
 *   {function} factory (optional)
 * @return {function}
 */
function mix(...args) {
    // todo: refactor to make const
    let superclass = !is(args[0], 'factory') && args.shift() || baseclass
    let factory = (is(args[args.length-1], 'factory') && args.pop()) || derive

    superclass = is(superclass, 'mixin') ? superclass.class : derive(superclass)
    if (args.length) factory = (org => superclass => org(args.reduce((s,m) => m.mixin(s), superclass)))(factory)

    function mixin(superclass) {
        const result = is(superclass, mixin) ? superclass : factory(superclass)

        if (mixin.classes.indexOf(result) === -1) mixin.classes.push(result)
        return result
    }

    Object.defineProperties(mixin, {
        classes: { value:[], writable:false },
        mixins: { value:args, writable:false },
    })

    const Class = mixin(superclass)
    const constructor = Class.hasOwnProperty('constructor')
        ? Class.constructor.bind(Class)
        : (...args) => new Class(...args)

    Object.getOwnPropertyNames(Class).forEach(k => Object.defineProperty(constructor, k, { value: Class[k] }))

    return Object.defineProperties(constructor, {
        mixin: { value:mixin, writable:false },
        class: { value: Class, writable:false },
        interface: { get:(x => () => x ? x : x = getInterface(Class.prototype))() },
    })
}

/**
 * Tests whether `x` is a type or extends from type.
 * Example: is(looker, Looker)
 *
 * @param {object|function} x
 * @param {string|function} type
 * @return {boolean}
 */
function is(x, type) {
    if (typeof type == 'string') {
        return type == 'class'
            ? (
                is(x, 'function') && (s => /^class\s/.test(s)
    || /^.*classCallCheck\(/.test(s.replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'')))(x.toString())
            )
            : type == 'mixin'
                ? is(x, 'function') && !!x.mixin
                : type == 'factory'
                    ? is(x, 'function') && !is(x, 'mixin') && !is(x, 'class') && x.length == 1
                    : typeof x == type;
    }

    if (typeof x == 'object') {
        if (x instanceof type) return true
        if (type.class && x instanceof type.class) return true
        if (type.mixin && type.mixin.classes) return type.mixin.classes.reduce((f,c) => f || is(x,c), false)
    }
    else if (typeof x == 'function') {
        if (x.mixin && x.mixin.mixins.indexOf(type) !== -1) return true

        let c = x

        while (c !== Object) {
            if (c === type || c === type.class) return true
            if (type.mixin && type.mixin.classes && type.mixin.classes.indexOf(c) !== -1) return true
            c = Object.getPrototypeOf(c.prototype).constructor
        }
    }

    return false
}

/**
 * Often, we don't really care whether the object is a certain type,
 * we just want to know whether we can treat it like a certain type.
 * Use like(subject, type) to test whether a subject adheres to the same interface as is defined by type
 * Example:
 *
 * var Looker = mix(superclass => class Looker extends superclass {
 *   look() {}
 * })
 *
 * var Viewer = {
 *   look() {} // same interface as Looker
 * }
 *
 * var viewer = new Viewer()
 * like(viewer, Looker) // true
 *
 * @param {object|function} x
 * @param {function} type
 * @return {boolean}
 */
function like(x, type) {
    if (is(x, type)) return true

    const itf = type.interface || (is(type, 'function') && getInterface(type.prototype))
    const subject = is(x, 'function') ? x.interface || getInterface(x.prototype) : x

    return itf && Object.keys(itf).reduce((f, k) => 
        f && (is(itf[k], 'function') ? is(subject[k], 'function') : k in subject), true
    )
}

/**
 * Get all parts of an interface as an array of strings
 *
 * @param {object} proto
 * @return {array<string>}
 */
function getInterface(proto) {
    return getPropertyNames(proto).reduce((o,k) => { o[k] = proto[k]; return o }, {})
}

/**
 * Get all properties of an object an an array of strings
 *
 * @param {object|function} proto
 * @return {array<string>}
 */
function getPropertyNames(proto) {
    const results = []

    while (proto !== Object.prototype) {
        Object.getOwnPropertyNames(proto).reduce((arr,k) => arr.indexOf(k) === -1 ? arr.push(k) && arr : arr, results)
        proto = Object.getPrototypeOf(proto).constructor.prototype
    }

    return results
}

const baseclass = class Object{}
const derive = superclass => ({}[superclass.name || 'Object'] = class extends superclass {})
