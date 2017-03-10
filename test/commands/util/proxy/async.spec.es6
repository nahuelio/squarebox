/**
*	@module commands.util.proxy
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import Asynchronous from 'commands/util/proxy/async';
import Command from 'commands/command';
import InterfaceException from 'commands/util/exception/proxy/interface';

describe('commands.util.proxy.Asynchronous', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.target = () => { return { next: (adt, resolve, reject) => {} }; };
		this.mockAsync = this.sandbox.mock(Asynchronous.prototype);
	});

	afterEach(() => {
		this.sandbox.restore();
		delete this.target;
		delete this.mockAsync;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(Asynchronous.proxy(this.target), Function);
		});

		it('Should Error: target is not defined', () => {
			assert.throws(() => Asynchronous.proxy(), InterfaceException.type.proxy());
		});

	});

	describe('do()', () => {

		it('Should return a decorated target with asynchronous capabilities', () => {
			const o = this.target();
			const exp = Asynchronous.proxy(o);
			assert.isNotNull(exp.do);
			assert.instanceOf(exp.do(o), Promise);
		});

	});

});
