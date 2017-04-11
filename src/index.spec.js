import ulog from 'ulog'
const log = ulog('mics:spec')
import { expect } from 'chai'
import { spy } from 'sinon'

import { mix, is } from './'

describe('mix([superclass] [, ...mixins] [, factory])', function(){
	it('is a function', function(){
		expect(mix).to.be.a('function')		
	})

	it('creates a mixin from an ES6 class factory', function(){
		var M = mix(superclass => class M extends superclass {})
		expect(M).to.be.a('function')
	})

	it('creates a mixin from other mixins and a class factory', function(){
		var X = mix(superclass => class X extends superclass {})
		var Y = mix(superclass => class X extends superclass {})
		var M = mix(X, Y, superclass => class M extends superclass {})
		expect(M).to.be.a('function')
	})

	it('creates a class from a superclass', function(){
		var C = mix(class Base {})
		expect(C).to.be.a('function')
	})

	it('creates a mixin that can be invoked with new', function(){
		var M = mix(superclass => class M extends superclass {})
		var m = new M()
		expect(m).to.be.an('object')
	})

	it('arguments passed when invoking the mixin with new are passed on to the constructor', function(){
		var xarg,yarg,zarg
		var M = mix(superclass => class M extends superclass {
			constructor(x, y, z) {
				super()
				xarg = x
				yarg = y
				zarg = z
			}
		})
		var m = new M('x','y','z')
		expect(xarg).to.eq('x')
		expect(yarg).to.eq('y')
		expect(zarg).to.eq('z')
	})


	it('var args in constructor has correct length', function(){
		var argsarg
		var M = mix(superclass => class M extends superclass {
			constructor(...args) {
				super()
				argsarg = args
			}
		})
		var m = new M('x','y','z')
		expect(argsarg.length).to.eq(3)
		var m = new M()
		expect(argsarg.length).to.eq(0)
	})
})

describe('is(x [, type])', function(){
	it('is a function', function(){
		expect(is).to.be.a('function')		
	})

	it('accepts one or two arguments', function(){
		expect(is.length).to.eq(2)		
	})

	it('when passed two arguments, acts as an alias for is(x).a(type)', function(){
		var X = mix(superclass => class X extends superclass {})
		var x = new X()
		expect(is(x).a(X)).to.eq(true)
		expect(is(x, X)).to.eq(true)
		expect(is(x).a(Date)).to.eq(is(x, Date))
	})

	it('when passed a single argument, returns an object with sub-methods', function(){
		expect(is({})).to.be.an('object')
	})

	describe('a(type)', function(){
		it('is a function', function(){
			expect(is({}).a).to.be.a('function')		
		})
		it('tests whether object `x` implements `type`', function(){
			var X = mix(superclass => class X extends superclass {})
			var x = new X()
			expect(is(x).a(X)).to.eq(true)
			expect(is(x).a(Date)).to.eq(false)
		})
		it('tests whether class `x` implements `type`', function(){
			var Y = mix(superclass => class Y extends superclass {})
			var X = class X extends mix(Y) {}
			expect(is(X).a(Y)).to.eq(true)
		})
		it('tests whether mixin `x` implements `type`', function(){
			var Y = mix(superclass => class Y extends superclass {})
			var X = mix(Y, superclass => class X extends superclass {})
			expect(is(X).a(Y)).to.eq(true)
		})
		it('for type == "class", tests whether `x` is an ES6 class', function(){
			expect(is(class X {}).a('class')).to.eq(true)
			expect(is(mix(superclass => class Y extends superclass {})).a('class')).to.eq(false)
			expect(is({}).a('class')).to.eq(false)
			expect(is('Hi').a('class')).to.eq(false)
			expect(is(function(){}).a('class')).to.eq(false)
			expect(is(function(x){}).a('class')).to.eq(false)
			expect(is(function(x,y){}).a('class')).to.eq(false)
		})
		it('for type == "mixin", tests whether `x` is a mixin', function(){
			expect(is(class X {}).a('mixin')).to.eq(false)
			expect(is(mix(superclass => class Y extends superclass {})).a('mixin')).to.eq(true)
			expect(is({}).a('mixin')).to.eq(false)
			expect(is('Hi').a('mixin')).to.eq(false)
			expect(is(function(){}).a('mixin')).to.eq(false)
			expect(is(function(x){}).a('mixin')).to.eq(false)
			expect(is(function(x,y){}).a('mixin')).to.eq(false)
		})
		it('for type == "mix", tests whether `x` is the result of calling mix()', function(){
			expect(is(class X {}).a('mix')).to.eq(false)
			expect(is(mix(class X {})).a('mix')).to.eq(true)
			expect(is(class X extends mix(){}).a('mix')).to.eq(true)
			expect(is(mix(superclass => class Y extends superclass {})).a('mix')).to.eq(true)
			expect(is({}).a('mix')).to.eq(false)
			expect(is('Hi').a('mix')).to.eq(false)
			expect(is(function(){}).a('mix')).to.eq(false)
			expect(is(function(x){}).a('mix')).to.eq(false)
			expect(is(function(x,y){}).a('mix')).to.eq(false)
		})
		it('for type == "factory", tests whether `x` is a class factory', function(){
			expect(is(class X {}).a('factory')).to.eq(false)
			expect(is(mix(class X {})).a('factory')).to.eq(false)
			expect(is(class X extends mix(){}).a('factory')).to.eq(false)
			expect(is(mix(superclass => class Y extends superclass {})).a('factory')).to.eq(false)
			expect(is({}).a('factory')).to.eq(false)
			expect(is('Hi').a('factory')).to.eq(false)
			expect(is(function(){}).a('factory')).to.eq(false)
			expect(is(function(x){}).a('factory')).to.eq(true)
			expect(is(function(x,y){}).a('factory')).to.eq(false)
		})
		it('for type == "function", tests whether `x` is a function', function(){
			expect(is(class X {}).a('function')).to.eq(true)
			expect(is(mix(class X {})).a('function')).to.eq(true)
			expect(is(class X extends mix(){}).a('function')).to.eq(true)
			expect(is(mix(superclass => class Y extends superclass {})).a('function')).to.eq(true)
			expect(is({}).a('function')).to.eq(false)
			expect(is('Hi').a('function')).to.eq(false)
			expect(is(function(){}).a('function')).to.eq(true)
			expect(is(function(x){}).a('function')).to.eq(true)
			expect(is(function(x,y){}).a('function')).to.eq(true)
		})
		it('for type == "object", tests whether `x` is an object', function(){
			expect(is(class X {}).a('object')).to.eq(false)
			expect(is(mix(class X {})).a('object')).to.eq(false)
			expect(is(class X extends mix(){}).a('object')).to.eq(false)
			expect(is(mix(superclass => class Y extends superclass {})).a('object')).to.eq(false)
			expect(is({}).a('object')).to.eq(true)
			expect(is('Hi').a('object')).to.eq(false)
			expect(is(function(){}).a('object')).to.eq(false)
			expect(is(function(x){}).a('object')).to.eq(false)
			expect(is(function(x,y){}).a('object')).to.eq(false)
		})
		it('for type == "string", tests whether `x` is a string', function(){
			expect(is(class X {}).a('string')).to.eq(false)
			expect(is(mix(class X {})).a('string')).to.eq(false)
			expect(is(class X extends mix(){}).a('string')).to.eq(false)
			expect(is(mix(superclass => class Y extends superclass {})).a('string')).to.eq(false)
			expect(is({}).a('string')).to.eq(false)
			expect(is('Hi').a('string')).to.eq(true)
			expect(is(function(){}).a('string')).to.eq(false)
			expect(is(function(x){}).a('string')).to.eq(false)
			expect(is(function(x,y){}).a('string')).to.eq(false)
		})
	})

	describe('an(type)', function(){
		it('is a function', function(){
			expect(is({}).a).to.be.a('function')		
		})
		it('is an alias for `a(type)`', function(){
			var x = is({})
			expect(x.a).to.eq(x.an)
		})
	})

	describe('as(type)', function(){
		it('is a function', function(){
			expect(is({}).as).to.be.a('function')		
		})
		it('tests whether `x` can be treated as `type` (has the same interface)', function(){
			var Looker = mix(superclass => class Looker extends superclass {
				look(){}
			})
			expect(is('Hi').as(Looker)).to.eq(false)
			expect(is(8).as(Looker)).to.eq(false)
			expect(is({}).as(Looker)).to.eq(false)
			expect(is(new Looker()).as(Looker)).to.eq(true)
			expect(is({look(){}}).as(Looker)).to.eq(true)
			expect(is({walk(){}}).as(Looker)).to.eq(false)
			class Base {look(){}}
			expect(is(Base).as(Looker)).to.eq(true)
			expect(is(new Base()).as(Looker)).to.eq(true)
			class Derived extends Base {}
			expect(is(Derived).as(Looker)).to.eq(true)
			expect(is(new Derived()).as(Looker)).to.eq(true)
		})

		it('allows mixins to be used as interfaces', (done) => {
			var expected = 'Hello, World!'
			var Thenable = mix(superclass => class Thenable extends superclass {
				then(results) {}
			})
			class MyPromise {
				then(resolve, reject) {
					resolve(expected)
				}
			}
			var promise = new MyPromise()
			expect(is(promise).as(Thenable)).to.eq(true)
			Promise.resolve(promise).then((result) => {
				expect(result).to.eq(expected)
				done()
			})
		})
	})
})

describe('mix example', function(){
	it ('shows how to create a mixin using an es6 class', function(){
		var constr = spy(), look = spy()

		var Looker = mix(superclass => class Looker extends superclass {
			constructor() {
				super()
				log.log('A looker is born!')
				constr()
			}
			look() {
				log.log('Looking good!')
				look()
			}
		})
		
		expect(Looker).to.be.a('function')

		var looker = new Looker()

		expect(looker).to.be.an('object')
		expect(constr.called).to.eq(true)

		expect(looker).to.have.a.property('look')
		expect(looker.look).to.be.a('function')

		looker.look()

		expect(look.called).to.eq(true)
	})

	it('shows how to composes multiple mixins', function(){
		var look = spy(), walk = spy(), talk = spy()
		var Looker = mix(superclass => class Looker extends superclass {
			look(){
				log.log('Looking good!')
				look()
			}
		})

		var Walker = mix(superclass => class Walker extends superclass {
			walk(){
				log.log('Step, step, step...')
				walk()
			}
		})

		var Talker = mix(superclass => class Talker extends superclass {
			talk(){
				log.log('Blah, blah, blah...')
				talk()
			}
		})
		
		var duckTalk = spy()
		var Duck = mix(Looker, Walker, Talker, superclass => class Duck extends superclass {
			talk(){
				log.log('Quack, quack, quack!')
				duckTalk()
				super.talk()
			}
		})

		var duck = new Duck()
		expect(duck).to.be.an('object')
		expect(duck).to.have.a.property('look')
		expect(duck.look).to.be.a('function')
		duck.look()
		expect(look.called).to.eq(true)
		expect(duck).to.have.a.property('walk')
		expect(duck.walk).to.be.a('function')
		duck.walk()
		expect(walk.called).to.eq(true)
		expect(duck).to.have.a.property('talk')
		expect(duck.talk).to.be.a('function')
		duck.talk()
		expect(talk.called).to.eq(true)
		expect(duckTalk.called).to.eq(true)
	})	
})
