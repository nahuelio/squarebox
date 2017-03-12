/**
*	@module commands.util.proxy
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import Json from 'commands/util/proxy/json';
import Visited from 'commands/util/visitor/visited';
import Command from 'commands/command';
import InterfaceException from 'commands/util/exception/proxy/interface';

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
		this.mockJson.verify();
		this.sandbox.restore();
		delete this.target;
		delete this.mockJson;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(Json.new(), Json);
		});

	});

	describe('visit()', () => {

		it('Should visit the target visited', () => {
			const input = Visited.new({ property: 'target' });
			const exp = Json.new();
			assert.instanceOf(exp.visit(input), Visited);
		});

		it('Should NOT visit the target visited', () => {
			const input = { property: 'target' };
			const exp = Json.new();
			assert.throws(() => exp.visit(input), InterfaceException.type
				.interface({ name: 'commands.util.visitor.Visited' }));
		});

	});

	describe('toJSON()', () => {

		it('Should return a json representation', () => {
			const input = this.target();
			const visited = Visited.new(input);
			const exp = Json.new().visit(visited);
			const out = exp.toJSON();
			assert.notDeepEqual(input, out);
		});

	});

});
