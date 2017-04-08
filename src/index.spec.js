import { expect } from 'chai'
import ulog from 'ulog'
const log = ulog('mics:spec')

import { mics, is } from './'

describe('mics', function(){
	it('is a function', function(){
		expect(mics).to.be.a('function')		
	})

	it('creates a mixin from an ES6 class factory', function(){
		var M = mics(superclass => class M extends superclass {})
		expect(M).to.be.a('function')
	})

	it('creates a mixin that can be invoked with new', function(){
		var M = mics(superclass => class M extends superclass {})
		var m = new M()
		expect(m).to.be.an('object')
	})

	it('composes multiple mixins', function(){
		var Looker = mics(superclass => class Looker extends superclass {
			look(){log.info('Looking good!')}
		})

		var Walker = mics(superclass => class Walker extends superclass {
			walk(){log.info('Step, step, step...')}
		})

		var Talker = mics(superclass => class Talker extends superclass {
			talk(){log.info('Blah, blah, blah...')}
		})
		
		var Duck = mics(Looker, Walker, Talker, superclass => class Duck extends superclass {
			talk(){log.info('Quack, quack, quack!')}
		})

		window.duck = new Duck()
		log.info('duck=', duck)
		duck.talk()
	})
})

