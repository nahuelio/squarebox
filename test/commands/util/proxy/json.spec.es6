/**
*	@module commands.util.proxy
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import Json from 'commands/util/proxy/json';
import Command from 'commands/command';

describe('commands.util.proxy.Json', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.target = () => {
			return {
				a: 1,
				b: true,
				regexp: new RegExp(),
				func: () => {},
				obj: { o_a: 1, o_b: true, func: () => {}, arr: [1, true, () => {}] },
				arr: [{
					a_o_a: 1,
					a_o_b: true,
					func: () => {},
					command: Command.new()
				}, 1, true, () => {}]
			};
		};
		this.mockJson = this.sandbox.mock(Json.prototype);
	});

	afterEach(() => {
		this.sandbox.restore();
		delete this.target;
		delete this.mockJson;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('#constructor', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(Json.proxy(this.target), Function);
		});

	});

	describe('#toJSON()', () => {

		it('Should return a json representation', () => {
			const o = this.target();
			const exp = Json.proxy(o);
			const out = exp.toJSON();
			assert.notEqual(o, out);
		});

	});

});
