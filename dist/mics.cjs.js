module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["mix"] = mix;
/* harmony export (immutable) */ __webpack_exports__["is"] = is;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var baseclass = function Object() {
	_classCallCheck(this, Object);
},
    derive = function derive(superclass) {
	return {}[superclass.name || 'Object'] = function (_superclass) {
		_inherits(_class, _superclass);

		function _class() {
			_classCallCheck(this, _class);

			return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
		}

		return _class;
	}(superclass);
};

function mix() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var superclass = !is(args[0]).a('factory') && args.shift() || baseclass;
	var factory = is(args[args.length - 1]).a('factory') && args.pop() || derive;
	superclass = is(superclass).a('mixin') ? superclass.class : derive(superclass);
	if (args.length) factory = function (org) {
		return function (superclass) {
			return org(args.reduce(function (s, m) {
				return m.mixin(s);
			}, superclass));
		};
	}(factory);
	function mixin(superclass) {
		var result = is(superclass).a(mixin) ? superclass : factory(superclass);
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

/* harmony default export */ __webpack_exports__["default"] = (mix);

function is(x, type) {
	function a(type) {
		if (typeof type == 'string') {
			return type == 'class' ? is(x).a('function') && function (s) {
				return (/^class\s/.test(s) || /^.*classCallCheck\(/.test(s.replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, ''))
				);
			}(x.toString()) : type == 'mixin' ? is(x).a('function') && !!x.mixin : type == 'factory' ? is(x).a('function') && !is(x).a('mixin') && !is(x).a('class') && x.length == 1 : (typeof x === 'undefined' ? 'undefined' : _typeof(x)) == type;
		}
		if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object') {
			if (x instanceof type) return true;
			if (type.class && x instanceof type.class) return true;
			if (type.mixin && type.mixin.classes) return type.mixin.classes.reduce(function (f, c) {
				return f || a(c);
			}, false);
		} else if (typeof x == 'function') {
			if (x.mixin && x.mixin.mixins.indexOf(type) !== -1) return true;
			var c = x;
			while (c !== Object) {
				if (c === type || c === type.class) return true;
				if (type.mixin && type.mixin.classes && type.mixin.classes.indexOf(c) !== -1) return true;
				c = c.prototype.__proto__.constructor;
			}
		}
		return false;
	}

	function as(type) {
		if (a(type)) return true;
		var itf = type.interface || is(type, 'function') && getInterface(type.prototype);
		var subject = is(x, 'function') ? x.interface || getInterface(x.prototype) : x;
		return itf && Object.keys(itf).reduce(function (f, k) {
			return f && (is(itf[k], 'function') ? is(subject[k], 'function') : k in subject);
		}, true);
	}

	var str = x && x.toString() || '';
	return type !== undefined ? a(type) : { a: a, an: a, as: as };
}

function getPropertyNames(proto) {
	var results = [];
	while (proto !== Object.prototype) {
		Object.getOwnPropertyNames(proto).reduce(function (arr, k) {
			return arr.indexOf(k) === -1 ? arr.push(k) && arr : arr;
		}, results);
		proto = proto.__proto__.constructor.prototype;
	}
	return results;
}

function getInterface(proto) {
	return getPropertyNames(proto).reduce(function (o, k) {
		o[k] = proto[k];return o;
	}, {});
}

/***/ })
/******/ ]);
//# sourceMappingURL=mics.cjs.js.map