(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/* harmony export (immutable) */ __webpack_exports__["mics"] = mics;
/* harmony export (immutable) */ __webpack_exports__["is"] = is;
/* harmony export (immutable) */ __webpack_exports__["getInterface"] = getInterface;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isClass", function() { return isClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMics", function() { return isMics; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function mics() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var _superclass = args.length && typeof args[0] == 'function' && isClass(args[0]) && args.shift();
	var factory = args.length && typeof args[args.length - 1] == 'function' && args[args.length - 1].length == 1 && !isMics(args[args.length - 1]) && args.pop();
	// if neither superclass nor factory are provided, create a new superclass
	if (!_superclass && !factory) _superclass = function superclass() {
		_classCallCheck(this, superclass);
	};
	if (_superclass) {
		if (!isMics(_superclass)) {
			_superclass = function (_superclass2) {
				_inherits(superclass, _superclass2);

				function superclass() {
					_classCallCheck(this, superclass);

					return _possibleConstructorReturn(this, (superclass.__proto__ || Object.getPrototypeOf(superclass)).apply(this, arguments));
				}

				return superclass;
			}(_superclass);
			Object.defineProperties(_superclass, {
				with: { get: function get() {
						return function () {
							for (var _len2 = arguments.length, mixins = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
								mixins[_key2] = arguments[_key2];
							}

							return mixins.reduce(function (c, m) {
								return m(c);
							}, _superclass);
						};
					} },
				interface: { get: function (x) {
						return function () {
							return x ? x : x = getInterface(_superclass.prototype);
						};
					}() }
			});
		}
		return args.length ? _superclass.with(args) : _superclass;
	}
	if (args.length) factory = function (org) {
		return function (superclass) {
			return org(args.reduce(function (c, m) {
				return m(c);
			}, superclass));
		};
	}(factory);
	function mixin(superclass) {
		for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
			args[_key3 - 1] = arguments[_key3];
		}

		if (this instanceof mixin) return new (Function.prototype.bind.apply(mixin.class, [null].concat([superclass], args)))();
		var result = is(superclass).a(mixin) ? superclass : factory(superclass);
		if (mixin.classes.indexOf(result) == -1) mixin.classes.push(result);
		return result;
	}
	Object.defineProperties(mixin, { classes: { value: [], writable: false } });
	// has to be 2 steps because mixin adds the created class to mixin.classes
	Object.defineProperties(mixin, {
		class: { value: mixin(function () {
				function _class() {
					_classCallCheck(this, _class);
				}

				return _class;
			}()), writable: false },
		with: { get: function get() {
				return function () {
					for (var _len4 = arguments.length, mixins = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
						mixins[_key4] = arguments[_key4];
					}

					return mics(mixin.class, mixins);
				};
			} },
		interface: { get: function (x) {
				return function () {
					return x ? x : x = getInterface(mixin.class.prototype);
				};
			}() }
	});
	return mixin;
}

/* harmony default export */ __webpack_exports__["default"] = (mics);

function is(obj, type) {
	function a(type) {
		if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object') {
			if (obj instanceof type) return true;
			if (type.classes) return type.classes.reduce(function (f, c) {
				return f || a(c);
			}, false);
		} else if (typeof obj == 'function') {
			var c = obj;
			while (c !== Object) {
				if (c === type) return true;
				if (type.classes && type.classes.indexOf(c) !== -1) return true;
				c = c.prototype.__proto__.constructor;
			}
		}
		return false;
	}
	function as(type) {
		if (a(type)) return true;
		var itf = type.interface || typeof type == 'function' && getInterface(type.prototype);
		var subject = typeof obj == 'function' ? obj.interface || getInterface(obj.prototype) : obj;
		return itf && Object.keys(itf).reduce(function (f, k) {
			return f && (typeof itf[k] == 'function' ? typeof subject[k] == 'function' : k in subject);
		}, true);
	}
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

var isClass = function isClass(x) {
	return x.toString().indexOf('class') === 0;
};
var isMics = function isMics(x) {
	return !!(x.interface && x.with);
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=mics.umd.js.map