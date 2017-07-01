'use strict';

const baseclass = class Object {};
const derive = superclass => ({}[superclass.name || 'Object'] = class extends superclass {});

const getPropertyNames = function getPropertyNames(proto) {
    const results = [];
    let p = proto;
    while (p !== Object.prototype) {
        Object
            .getOwnPropertyNames(proto)
            .reduce((arr, k) => (arr.indexOf(k) === -1 ? arr.push(k) && arr : arr), results);

        p = Object.getPrototypeOf(p).constructor.prototype;
    }

    return results;
};

const getInterface = function getInterface(proto) {
    return getPropertyNames(proto).reduce((o, k) => {
        const obj = o;
        obj[k] = proto[k];
        return obj;
    }, {});
};

function is(x, type) {
    if (typeof type === 'string') {
        switch (type) {
        case 'class': {
            return is(x, 'function') && (
                /^class\s/.test(x)
                || /^.*classCallCheck\(/.test(x.replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, ''))
            );
        }
        case 'mixin': return is(x, 'function') && !!x.mixin;
        case 'factory': return is(x, 'function') && !is(x, 'mixin') && !is(x, 'class') && x.length === 1;
        // We already made sure that type contains a string, so it should contain a type or the API was misused.
        // eslint-disable-next-line valid-typeof
        default: return typeof x === type;
        }
    }

    if (typeof x === 'object') {
        if (x instanceof type) return true;
        if (type.class && x instanceof type.class) return true;
        if (type.mixin && type.mixin.classes) return type.mixin.classes.reduce((f, c) => f || is(x, c), false);
    } else if (typeof x === 'function') {
        if (x.mixin && x.mixin.mixins.indexOf(type) !== -1) return true;
        let c = x;
        while (c !== Object) {
            if (c === type || c === type.class) return true;
            if (type.mixin && type.mixin.classes && type.mixin.classes.indexOf(c) !== -1) return true;
            c = Object.getPrototypeOf(c.prototype).constructor;
        }
    }

    return false;
}

function mix(...args) {
    let superclass = is(args[0], 'factory') ? args.shift() : baseclass;
    let factory = is(args[args.length - 1], 'factory') ? args.pop() : derive;

    superclass = is(superclass, 'mixin') ? superclass.class : derive(superclass);
    if (args.length > 0) factory = sc => factory(args.reduce((s, m) => m.mixin(s), sc));

    const mixin = function mixin(sc) {
        const result = is(sc, mixin) ? sc : factory(sc);
        if (mixin.classes.indexOf(result) === -1) mixin.classes.push(result);
        return result;
    };

    Object.defineProperties(mixin, {
        classes: { value: [], writable: false },
        mixins: { value: args, writable: false },
    });

    const Class = mixin(superclass);
    const constructor = Object.prototype.hasOwnProperty.call(Class, 'constructor')
        ? Class.constructor.bind(Class)
        : (...params) => new Class(...params);

    Object.getOwnPropertyNames(Class).forEach(k => Object.defineProperty(constructor, k, { value: Class[k] }));

    return Object.defineProperties(constructor, {
        mixin: { value: mixin, writable: false },
        class: { value: Class, writable: false },
        interface: { get: () => getInterface(Class.prototype) },
    });
}

function like(x, type) {
    if (is(x, type)) return true;

    const itf = type.interface || (is(type, 'function') && getInterface(type.prototype));
    const subject = is(x, 'function') ? x.interface || getInterface(x.prototype) : x;

    return itf && Object.keys(itf).reduce(
        (f, k) => {
            if (f) {
                return (is(itf[k], 'function') ? is(subject[k], 'function') : k in subject);
            }

            return false;
        },
        true
    );
}

export { mix, is, like };
