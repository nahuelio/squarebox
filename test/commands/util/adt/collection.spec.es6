/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Collection from 'commands/util/adt/collection';
import Command from 'commands/command';

describe('commands.util.adt.Collection', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockCollection = this.sandbox.mock(Collection);
	});

	afterEach(() => {
		this.sandbox.restore();
		delete this.mockCollection;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('#constructor', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(Collection.new(), Collection);
		});

		it('Should get a new instance with elements', () => {
			const exp = Collection.new([{ option: 1 }, { option: 2}]);
			assert.isFalse(exp.isEmpty());
			assert.equal(2, exp.size());
		});

		it('Should get a new instance with elements (interface)', () => {
			const exp = Collection.new([{ option: true }, { option: false }], { interface: Command }).toJSON();
			assert.isArray(exp);
			assert.instanceOf(exp[0], Command);
		});

	});

});
