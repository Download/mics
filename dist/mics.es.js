var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function mix() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    // todo: refactor to make const
    var superclass = !is(args[0], 'factory') && args.shift() || baseclass;
    var factory = is(args[args.length - 1], 'factory') && args.pop() || derive;

    superclass = is(superclass, 'mixin') ? superclass.class : derive(superclass);
    if (args.length) factory = function (org) {
        return function (superclass) {
            return org(args.reduce(function (s, m) {
                return m.mixin(s);
            }, superclass));
        };
    }(factory);

    function mixin(superclass) {
        var result = is(superclass, mixin) ? superclass : factory(superclass);

        if (mixin.classes.indexOf(result) === -1) mixin.classes.push(result);
        return result;
    }

    Object.defineProperties(mixin, {
        classes: { value: [], writable: false },
        mixins: { value: args, writable: false }
    });

    var Class = mixin(superclass);
    var constructor = Class.hasOwnProperty('constructor') ? Class.constructor.bind(Class) : function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return new (Function.prototype.bind.apply(Class, [null].concat(args)))();
    };

    Object.getOwnPropertyNames(Class).forEach(function (k) {
        return Object.defineProperty(constructor, k, { value: Class[k] });
    });

    return Object.defineProperties(constructor, {
        mixin: { value: mixin, writable: false },
        class: { value: Class, writable: false },
        interface: { get: function (x) {
                return function () {
                    return x ? x : x = getInterface(Class.prototype);
                };
            }() }
    });
}

function is(x, type) {
    if (typeof type == 'string') {
        return type == 'class' ? is(x, 'function') && function (s) {
            return (/^class\s/.test(s) || /^.*classCallCheck\(/.test(s.replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, ''))
            );
        }(x.toString()) : type == 'mixin' ? is(x, 'function') && !!x.mixin : type == 'factory' ? is(x, 'function') && !is(x, 'mixin') && !is(x, 'class') && x.length == 1 : (typeof x === 'undefined' ? 'undefined' : _typeof(x)) == type;
    }

    if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object') {
        if (x instanceof type) return true;
        if (type.class && x instanceof type.class) return true;
        if (type.mixin && type.mixin.classes) return type.mixin.classes.reduce(function (f, c) {
            return f || is(x, c);
        }, false);
    } else if (typeof x == 'function') {
        if (x.mixin && x.mixin.mixins.indexOf(type) !== -1) return true;

        var c = x;

        while (c !== Object) {
            if (c === type || c === type.class) return true;
            if (type.mixin && type.mixin.classes && type.mixin.classes.indexOf(c) !== -1) return true;
            c = Object.getPrototypeOf(c.prototype).constructor;
        }
    }

    return false;
}

function like(x, type) {
    if (is(x, type)) return true;

    var itf = type.interface || is(type, 'function') && getInterface(type.prototype);
    var subject = is(x, 'function') ? x.interface || getInterface(x.prototype) : x;

    return itf && Object.keys(itf).reduce(function (f, k) {
        return f && (is(itf[k], 'function') ? is(subject[k], 'function') : k in subject);
    }, true);
}

function getInterface(proto) {
    return getPropertyNames(proto).reduce(function (o, k) {
        o[k] = proto[k];return o;
    }, {});
}

function getPropertyNames(proto) {
    var results = [];

    while (proto !== Object.prototype) {
        Object.getOwnPropertyNames(proto).reduce(function (arr, k) {
            return arr.indexOf(k) === -1 ? arr.push(k) && arr : arr;
        }, results);
        proto = Object.getPrototypeOf(proto).constructor.prototype;
    }

    return results;
}

var baseclass = function Object() {
    _classCallCheck(this, Object);
};
var derive = function derive(superclass) {
    return {}[superclass.name || 'Object'] = function (_superclass) {
        _inherits(_class, _superclass);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        return _class;
    }(superclass);
};

export { mix, is, like };
//# sourceMappingURL=mics.es.js.map
