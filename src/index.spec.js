import { expect } from 'chai'
import ulog from 'ulog'
const log = ulog('mics:spec')

import { mixin, mix, is } from './'

describe('mics', function(){
	it('Multiple Inheritance Class System', function(){})
	it('intuitive mixins for ES6 classes', function(){})

	describe('mixin', function(){
		it('is a function', function(){
			expect(mixin).to.be.a('function')		
		})
		it('creates a mixin from an ES6 class factory', function(){
			var M = mixin(superclass => class M extends superclass {})
			expect(M).to.be.a('function')
		})
		it('creates a mixin that can be invoked with new', function(){
			var M = mixin(superclass => class M extends superclass {})
			var m = new M()
			expect(m).to.be.an('object')
		})
		it('composes multiple mixins', function(){
			var Looker = mixin(superclass => class Looker extends superclass {
				look(){log.info('Looking good!')}
			})
			var Walker = mixin(superclass => class Walker extends superclass {
				walk(){log.info('Step, step, step...')}
			})
			var Talker = mixin(superclass => class Talker extends superclass {
				talk(){log.info('Blah, blah, blah...')}
			})
			var Duck = mixin(Looker, Walker, Talker, superclass => class Duck extends superclass {
				talk(){log.info('Quack, quack, quack!')}
			})

			var duck = new Duck()
			log.info('duck=', duck)
			duck.talk()
		})
	})

	describe('mix', function(){
		it('is a function', function(){
			expect(mix).to.be.a('function')		
		})
	})

	describe('is', function(){
		it('is a function', function(){
			expect(is).to.be.a('function')		
		})
	})

	it('supports mixins', function(){
		var Driver = mixin(superclass => class Driver extends superclass {  
			constructor() {
				super()
				log.info('A driver is born!')
			}
			drive() {
				log.info('Vroom Vroom!!')
			}
		})

		var Swimmer = mixin(superclass => class extends superclass {  
			constructor() {
				super()
				log.info('A swimmer is born!')
			}
			swim() {
				log.info('Splash splash!')
			}
			dive() {
				log.info('Blub blub!')
			}
		})

		class Sporter extends mix().with(Driver, Swimmer) {
			constructor() {
				super()
				log.info('A sporter is born!')
			}
			sport() {
				this.swim()
				this.drive()
			}
		}

		class F1Driver {
			drive() {
				
			}
		}

		var sporter = new Sporter()
		log.info('sporter: ', sporter)
		sporter.sport()

		var shumacher = new F1Driver()

		log.info('is sporter a Swimmer? ', is(sporter).a(Swimmer))
		log.info('is sporter a Driver? ', is(sporter).a(Driver))
		log.info('is sporter a Sporter? ', is(sporter).a(Sporter))
		log.info('is object as Swimmer? ', is({swim(){}, dive(){}}).as(Swimmer))
		log.info('is shumacher as Driver? ', is(shumacher).as(Driver))
		log.info('is F1Driver a Driver? ', is(F1Driver).a(Driver))
		log.info('is F1Driver as Driver? ', is(F1Driver).as(Driver))
		log.info('is F1Driver as Swimmer? ', is(F1Driver).as(Swimmer))

		window.genericDriver = new Driver();
		log.info('genericDriver: ', genericDriver)
		log.info('is genericDriver a Driver? ', is(genericDriver).a(Driver))
		
		log.info()
	})
})