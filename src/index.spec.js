import ulog from 'ulog'
import { expect } from 'chai'
import { spy } from 'sinon'
import t from 'tcomb'

import { mix, is, like } from './'

const log = ulog('mics:spec')

describe('mix([superclass] [, ...mixins] [, factory])', function() {
    it('is a function', function(){
        expect(mix).to.be.a('function')		
    })

    it('creates a mixin from a class factory', function(){
        const M = mix(superclass => class M extends superclass {})

        expect(M).to.be.a('function')
    })

    it('creates a mixin from other mixins and a class factory', function(){
        const X = mix(superclass => class X extends superclass {})
        const Y = mix(superclass => class X extends superclass {})
        const M = mix(X, Y, superclass => class M extends superclass {})

        expect(M).to.be.a('function')
    })

    it('creates a mixin from other mixins', function(){
        const X = mix(superclass => class X extends superclass {})
        const Y = mix(superclass => class X extends superclass {})
        const M = mix(X, Y)

        expect(is(M, 'mixin')).to.eq(true)
    })

    it('creates a mix from a superclass', function(){
        let C = mix(class Base {})

        expect(C).to.be.a('function')
        expect(is(C, 'mixin')).to.eq(true)
        // special case: class with one-arg constructor looks like a factory
        class Base {constructor(){}}
        C = mix(Base)
        expect(C).to.be.a('function')
        expect(is(C, 'mixin')).to.eq(true)
        expect(new C() instanceof Base).to.eq(true)
    })

    it('creates a mix from a mixed superclass', function(){
        const C = mix(class Base {})
        const D = mix(C)

        expect(is(C, 'mixin')).to.eq(true)
        expect(is(D, 'mixin')).to.eq(true)
        expect(new D() instanceof D).to.eq(true)
    })

    it('created mixins can be invoked with new to instantiate instances', function(){
        const M = mix(superclass => class M extends superclass {})
        const m = new M()

        expect(m).to.be.an('object')
    })

    it('created mixins can be invoked without new to instantiate instances', function(){
        const M = mix(superclass => class M extends superclass {})
        const m = M()

        expect(m).to.be.an('object')
    })

    it('arguments passed when invoking the mixin with new are passed on to the constructor', function(){
        let xarg,yarg,zarg
        const M = mix(superclass => class M extends superclass {
            constructor(x, y, z) {
                super()
                xarg = x
                yarg = y
                zarg = z
            }
        })

        new M('x','y','z')

        expect(xarg).to.eq('x')
        expect(yarg).to.eq('y')
        expect(zarg).to.eq('z')
    })

    it('arguments passed when invoking the mixin without new are passed on to the constructor', function(){
        let xarg,yarg,zarg
        const M = mix(superclass => class M extends superclass {
            constructor(x, y, z) {
                super()
                xarg = x
                yarg = y
                zarg = z
            }
        })

        new M('x','y','z')
        expect(xarg).to.eq('x')
        expect(yarg).to.eq('y')
        expect(zarg).to.eq('z')
    })

    it('var args in constructor has correct length when invoking with new', function(){
        let argsarg
        const M = mix(superclass => class M extends superclass {
            constructor(...args) {
                super()
                argsarg = args
            }
        })

        new M('x','y','z')
        expect(argsarg.length).to.eq(3)

        new M()
        expect(argsarg.length).to.eq(0)
    })

    it('var args in constructor has correct length when invoking without new', function(){
        let argsarg
        const M = mix(superclass => class M extends superclass {
            constructor(...args) {
                super()
                argsarg = args
            }
        })

        M('x','y','z')
        expect(argsarg.length).to.eq(3)

        M()
        expect(argsarg.length).to.eq(0)
    })

    it('result of invoking constructor with new is instanceof mixin', function(){
        const M = mix(superclass => class M extends superclass {})
        const m = new M('x','y','z')

        expect(m instanceof M).to.eq(true)
    })

    it('result of invoking constructor without new is instanceof mixin', function(){
        const M = mix(superclass => class M extends superclass {})
        const m = M('x','y','z')

        expect(m instanceof M).to.eq(true)
    })

    it('picks up a static class method `constructor` and uses it in place of the default constructor', function(){
        const check = spy()
        const M = mix(superclass => class M extends superclass {
            static constructor(...args) {
            	// todo: missing superclass constructor invocation?
                log.log('Custom constructor')
                check()
                return new this(...args)
            }
        })

        M()
        expect(check.called).to.eq(true)
    })

    it('has no side effects on it\'s arguments', function(){
        class Test{}
        expect(is(Test, 'mixin')).to.eq(false)
        const M = mix(Test)

        expect(is(M, 'mixin')).to.eq(true)
        expect(is(Test, 'mixin')).to.eq(false)
        const N = mix(Test, superclass => class N extends superclass {})

        expect(is(N, 'mixin')).to.eq(true)
        expect(is(Test, 'mixin')).to.eq(false)
    })
})


describe('is(x , type)', function(){
    it('is a function', function(){
        expect(is).to.be.a('function')		
    })

    it('accepts one or two arguments', function(){
        expect(is.length).to.eq(2)		
    })

    it('tests whether object `x` implements `type`', function(){
        const X = mix(superclass => class X extends superclass {})
        const x = new X()

        expect(is(x, X)).to.eq(true)
        expect(is(x, Date)).to.eq(false)
    })
    it('tests whether class `x` implements `type`', function(){
        const Y = mix(superclass => class Y extends superclass {})
        const X = class X extends mix(Y) {}

        expect(is(X, Y)).to.eq(true)
    })
    it('tests whether mixin `x` implements `type`', function(){
        const Y = mix(superclass => class Y extends superclass {})
        const X = mix(Y, superclass => class X extends superclass {})

        expect(is(X, Y)).to.eq(true)
    })
    it('for type == "mixin", tests whether `x` is a mixin', function(){
        expect(is(class X {}, 'mixin')).to.eq(false)
        expect(is(mix(superclass => class Y extends superclass {}), 'mixin')).to.eq(true)
        expect(is({}, 'mixin')).to.eq(false)
        expect(is('Hi', 'mixin')).to.eq(false)
        expect(is(function(){}, 'mixin')).to.eq(false)
        expect(is(function(x){}, 'mixin')).to.eq(false)
        expect(is(function(x,y){}, 'mixin')).to.eq(false)
    })
    it('for type == "factory", tests whether `x` is a class factory', function(){
        expect(is(class X {}, 'factory')).to.eq(false)
        expect(is(mix(class X {}), 'factory')).to.eq(false)
        expect(is(class X extends mix(){}, 'factory')).to.eq(false)
        expect(is(mix(superclass => class Y extends superclass {}), 'factory')).to.eq(false)
        expect(is({}, 'factory')).to.eq(false)
        expect(is('Hi', 'factory')).to.eq(false)
        expect(is(function(){}, 'factory')).to.eq(false)
        expect(is(function(x){}, 'factory')).to.eq(true)
        expect(is(function(x,y){}, 'factory')).to.eq(false)
    })
    it('for type == "function", tests whether `x` is a function', function(){
        expect(is(class X {}, 'function')).to.eq(true)
        expect(is(mix(class X {}), 'function')).to.eq(true)
        expect(is(class X extends mix(){}, 'function')).to.eq(true)
        expect(is(mix(superclass => class Y extends superclass {}), 'function')).to.eq(true)
        expect(is({}, 'function')).to.eq(false)
        expect(is('Hi', 'function')).to.eq(false)
        expect(is(function(){}, 'function')).to.eq(true)
        expect(is(function(x){}, 'function')).to.eq(true)
        expect(is(function(x,y){}, 'function')).to.eq(true)
    })
    it('for type == "object", tests whether `x` is an object', function(){
        expect(is(class X {}, 'object')).to.eq(false)
        expect(is(mix(class X {}), 'object')).to.eq(false)
        expect(is(class X extends mix(){}, 'object')).to.eq(false)
        expect(is(mix(superclass => class Y extends superclass {}), 'object')).to.eq(false)
        expect(is({}, 'object')).to.eq(true)
        expect(is('Hi', 'object')).to.eq(false)
        expect(is(function(){}, 'object')).to.eq(false)
        expect(is(function(x){}, 'object')).to.eq(false)
        expect(is(function(x,y){}, 'object')).to.eq(false)
    })
    it('for type == "string", tests whether `x` is a string', function(){
        expect(is(class X {}, 'string')).to.eq(false)
        expect(is(mix(class X {}), 'string')).to.eq(false)
        expect(is(class X extends mix(){}, 'string')).to.eq(false)
        expect(is(mix(superclass => class Y extends superclass {}), 'string')).to.eq(false)
        expect(is({}, 'string')).to.eq(false)
        expect(is('Hi', 'string')).to.eq(true)
        expect(is(function(){}, 'string')).to.eq(false)
        expect(is(function(x){}, 'string')).to.eq(false)
        expect(is(function(x,y){}, 'string')).to.eq(false)
    })
})

describe('like(type)', function(){
    it('is a function', function(){
        expect(like).to.be.a('function')		
    })
    it('tests whether `x` can be treated as `type` (has the same interface)', function(){
        const Looker = mix(superclass => class Looker extends superclass {
            look(){}
        })

        expect(like('Hi', Looker)).to.eq(false)
        expect(like(8, Looker)).to.eq(false)
        expect(like({}, Looker)).to.eq(false)
        expect(like(new Looker(), Looker)).to.eq(true)
        expect(like({ look(){} }, Looker)).to.eq(true)
        expect(like({ walk(){} }, Looker)).to.eq(false)
        class Base {look(){}}
        expect(like(Base, Looker)).to.eq(true)
        expect(like(new Base(), Looker)).to.eq(true)
        class Derived extends Base {}
        expect(like(Derived, Looker)).to.eq(true)
        expect(like(new Derived(), Looker)).to.eq(true)
    })

    it('allows mixins to be used as interfaces', (done) => {
        const expected = 'Hello, World!'
        const Thenable = mix(superclass => class Thenable extends superclass {
            then(results) {}
        })

        class MyPromise {
            then(resolve, reject) {
                resolve(expected)
            }
        }

        const promise = new MyPromise()

        expect(like(promise, Thenable)).to.eq(true)
        Promise.resolve(promise).then((result) => {
            expect(result).to.eq(expected)
            done()
        })
    })
})

describe('mix example', function(){
    it ('shows how to create a mixin using an es6 class', function(){
        const constr = spy()
        const look = spy()

        const Looker = mix(superclass => class Looker extends superclass {
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

        const looker = new Looker()

        expect(looker).to.be.an('object')
        expect(constr.called).to.eq(true)

        expect(looker).to.have.a.property('look')
        expect(looker.look).to.be.a('function')

        looker.look()

        expect(look.called).to.eq(true)
    })

    it('shows how to composes multiple mixins', function(){
        const look = spy()
        const walk = spy()
        const talk = spy()
        const Looker = mix(superclass => class Looker extends superclass {
            look(){
                log.log('Looking good!')
                look()
            }
        })

        const Walker = mix(superclass => class Walker extends superclass {
            walk(){
                log.log('Step, step, step...')
                walk()
            }
        })

        const Talker = mix(superclass => class Talker extends superclass {
            talk(){
                log.log('Blah, blah, blah...')
                talk()
            }
        })

        const duckTalk = spy()

        const Duck = mix(Looker, Walker, Talker, superclass => class Duck extends superclass {
            talk(){
                log.log('Quack, quack, quack!')
                duckTalk()
                super.talk()
            }
        })

        const duck = new Duck()

        expect(duck).to.be.an('object')
        expect(duck instanceof Duck).to.eq(true)
        expect(duck instanceof Looker).to.eq(true)
        expect(duck instanceof Walker).to.eq(false)
		

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


describe('type checked mixins with tcomb', function(){
    it ('shows how to create an immutable, type-checked mixin with tcomb', function(){
        // This is experimental... I think it shows we need to be able to hook into the
        // mixin process itself. To enable this example I already added a hook for the
        // ES5 constructor function: the `static constructor` will be picked up by `mix`
        // and used as the result instead of the default generated constructor.
        const a = spy()
        const b = spy()
        const Person = mix(superclass => class Person extends superclass {
            static get type() {
                if (!this._tcomb) this._tcomb = t.struct({
                    name: t.String, // required string
                    surname: t.maybe(t.String), // optional string
                    age: t.Integer, // required integer
                    tags: t.list(t.String) // a list of strings
                }, 'Person')
                return this._tcomb
            }

            static testA() {
                a()
                log.log('A')
            }

            static testB() {
                this.testA()
                b()
                log.log('B')
            }

            static constructor(...args) {
                // todo: missing superclass constructor call?
                return this.type(new this(...args))
            }

            constructor(...args) {
                super(...args)
                Object.assign(this, ...args)
            }
        })
		
        expect(function(){
            const person = Person({
                surname: 'Canti'
            });	
        }).to.throw(TypeError) // required fields missing
		
        expect(function(){
            const person = Person({
                name: 'Stijn',
                age: 40,
                tags: ['developer']
            });	
        }).to.not.throw() // ok
		
        expect(function(){
            const person = Person({
                name: 'Stijn',
                age: 40,
                tags: ['developer']
            });	

            person.age = 41
        }).to.throw(TypeError) // immutable

        expect(function(){
            Person.testB()
            expect (a.called).to.eq(true)
            expect (b.called).to.eq(true)
        }).to.not.throw() // ok
    })
})
