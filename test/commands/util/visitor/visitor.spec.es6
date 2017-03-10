/**
*	@module commands.util.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Visitor from 'commands/util/visitor/visitor';
import Visited from 'commands/util/visitor/visited';
import InterfaceException from 'commands/util/exception/proxy/interface';

describe('commands.util.visitor.Visitor', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(Visitor.prototype);
	});

	afterEach(() => {
		this.mockProto.verify();
		this.sandbox.restore();
		delete this.mockProto;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor', () => {

		it('Should get a new instance', () => {
			const exp = Visitor.new();
			assert.instanceOf(exp, Visitor);
			assert.equal(exp.name, 'Visitor');
		});

	});

	describe('validate', () => {

		it('Should return true', () => {
			const exp = Visitor.new();
			const input = Visited.new({});
			assert.isTrue(exp.validate(input));
		});

		it('Should return false: visited not defined', () => {
			const exp = Visitor.new();
			assert.isFalse(exp.validate());
		});

		it('Should throw InterfaceException: visited doesn\'t implement his interface', () => {
			const exp = Visitor.new();
			assert.throws(() => exp.validate({}),
				InterfaceException.type.interface({ name: 'commands.util.visitor.Visited' }));
		});

	});

	describe('visit', () => {

		it('Should visit the visted instance', () => {
			const exp = Visitor.new();
			const input = Visited.new({});
			const expValidate = this.mockProto.expects('validate')
				.once()
				.withArgs(input)
				.returns(true);

			assert.instanceOf(exp.visit(input), Object);
		});

		it('Should NOT visit the visted instance', () => {
			const exp = Visitor.new();
			const input = {};
			const expValidate = this.mockProto.expects('validate')
				.once()
				.withArgs(input)
				.returns(false);

			assert.isNull(exp.visit(input));
		});

	});

});
