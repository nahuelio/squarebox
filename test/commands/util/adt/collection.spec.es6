/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Collection from 'commands/util/adt/collection';
import Command from 'commands/command';

describe('commands.util.adt.Collection', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
		this.test = null;
	});

	beforeEach(() => {
		this.mockCollection = this.sandbox.mock(Collection);
	});

	afterEach(() => {
		this.sandbox.restore();
		delete this.mockCollection;
	});

	after(() => {
		delete this.test;
		delete this.sandbox;
	});

	describe('#constructor()', () => {

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

	describe('#set()', () => {

		it('Should set new elements', () => {});
		it('Should NOT set new elements', () => {});

	});

	describe('#add()', () => {

		it('Should add a new element', () => {});
		it('Should NOT add a new element', () => {});

	});

	describe('#addAll()', () => {

		it('Should add new elements', () => {});
		it('Should NOT add new elements', () => {});

	});

	describe('#get()', () => {

		it('Should get an element', () => {});
		it('Should NOT get an element', () => {});

	});

	describe('#contains()', () => {

		it('Should contain an element', () => {});
		it('Should NOT contain an element', () => {});

	});

	describe('#containsAl()', () => {

		it('Should contain all elements', () => {});
		it('Should NOT contain at least one element', () => {});

	});

	describe('#containsWhere()', () => {

		it('Should contain an element with condition', () => {});
		it('Should NOT contain an element with condition', () => {});

	});

	describe('#remove()', () => {

		it('Should remove an element', () => {});
		it('Should NOT remove an element', () => {});

	});

	describe('#removeAll()', () => {

		it('Should remove all the elements', () => {});
		it('Should NOT remove all the elements', () => {});

	});

	describe('#removeBy()', () => {

		it('Should remove elments by predicate', () => {});
		it('Should NOT remove elements by predicate', () => {});

	});

	describe('#sort()', () => {

		it('Should sort by comparator', () => {});
		it('Should NOT sort', () => {});

	});

	describe('#iterator()', () => {

		it('Should get an iterator from collection', () => {});

	});

	describe('#reset()', () => {

		it('Should reset the collection', () => {});

	});

	describe('#size()', () => {

		it('Should get the size of the collection', () => {});

	});

	describe('#isEmpty()', () => {

		it('Should be empty', () => {});
		it('Should NOT be empty', () => {});

	});

	describe('#hasInterface()', () => {

		it('Should have interface defined', () => {});
		it('Should NOT have interface defined', () => {});

	});

	describe('#toJSON()', () => {

		it('Should get a json representation', () => {});

	});

});
