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
		this.mockCollection = this.sandbox.mock(Collection.prototype);
	});

	afterEach(() => {
		this.mockCollection.verify();
		this.sandbox.restore();
		delete this.mockCollection;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(Collection.new(), Collection);
		});

		it('Should get a new instance with elements', () => {
			const exp = Collection.new([{ option: 1 }, { option: 2}]);
			assert.isFalse(exp.isEmpty());
			assert.equal(2, exp.size());
		});

		it('Should get a new instance with elements (interface)', () => {
			const exp = Collection.new([{ option: true }, { option: false }], { interface: Command });
			assert.instanceOf(exp.get(0), Command);
		});

	});

	describe('set()', () => {

		it('Should set new elements (with Event)', () => {
			const exp = Collection.new();
			const toSet = [1, 2, 3];
			const expReset = this.mockCollection.expects('reset')
				.once()
				.withArgs({ silent: true })
				.returns(exp);

			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.set, exp, toSet)
				.returns(exp);

			exp.set(toSet);

			assert.equal(3, exp.size());
			assert.equal(toSet[1], exp.get(1));
		});

		it('Should set new elements (without Event)', () => {
			const exp = Collection.new();
			const toSet = [1, 2, 3];
			const expReset = this.mockCollection.expects('reset')
				.once()
				.withArgs({ silent: true })
				.returns(exp);

			const expEmit = this.mockCollection.expects('emit').never();

			exp.set(toSet, { silent: true });

			assert.equal(3, exp.size());
			assert.equal(toSet[1], exp.get(1));
		});

		it('Should NOT set new elements', () => {
			const exp = Collection.new();
			const expReset = this.mockCollection.expects('reset').never();

			assert.instanceOf(exp.set(), Collection); // undefined
			assert.instanceOf(exp.set({ option: 'notAnArray' }), Collection); // not an array
		});

	});

	describe('add()', () => {

		it('Should add a new element (with Event)', () => {
			const toAdd = { env: 'production' };
			const exp = Collection.new([], { interface: Command });
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.add, exp, toAdd)
				.returns(toAdd);

			exp.add(toAdd);
			assert.isFalse(exp.isEmpty());
			assert.instanceOf(exp.get(0), Command);
		});

		it('Should add a new element (without Event)', () => {
			const toAdd = { env: 'production' };
			const exp = Collection.new([], { interface: Command });
			const expEmit = this.mockCollection.expects('emit').never();

			exp.add(toAdd, { silent: true });
			assert.isFalse(exp.isEmpty());
			assert.instanceOf(exp.get(0), Command);
		});

		it('Should NOT add a new element', () => {
			const exp = Collection.new();
			const expEmit = this.mockCollection.expects('emit').never();

			assert.isNull(exp.add());
		});

	});

	describe('addAll()', () => {

		it('Should add new elements', () => {
			const toAdd = [4,5];
			const exp = Collection.new([1,2,3]);
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.addall, exp, toAdd)
				.returns(exp);

			assert.instanceOf(exp.addAll(toAdd), Collection);
			assert.isFalse(exp.isEmpty());
			assert.equal(5, exp.size());
			assert.equal(4, exp.get(3));
		});

		it('Should NOT add new elements', () => {
			const exp = Collection.new();
			const expEmit = this.mockCollection.expects('emit').never();

			assert.instanceOf(exp.addAll(), Collection);
			assert.instanceOf(exp.addAll({ invalid: true }), Collection);
		});

	});

	describe('get()', () => {

		it('Should get an element', () => {
			const exp = Collection.new(['hello', 'world']);
			assert.equal('world', exp.get(1));
			assert.equal('hello', exp.get());
		});

		it('Should NOT get an element', () => {
			const exp = Collection.new(['hello', 'world']);
			assert.isUndefined(exp.get(3));
		});

	});

	describe('contains()', () => {

		it('Should contain an element (without interface)', () => {
			const exp = Collection.new([{ option: 1 }, { option: 2 }]);
			assert.isTrue(exp.contains({ option: 2 }));
		});

		it('Should contain an element (with interface)', () => {
			const exp = Collection.new([{ env: 'production' }, { env: 'staging' }], { interface: Command });
			assert.isTrue(exp.contains(exp.get(1).toJSON()));
		});

		it('Should NOT contain an element', () => {
			const exp = Collection.new([{ option: 1 }, { option: 2 }]);
			assert.isFalse(exp.contains({ option: 3 }));
			assert.isFalse(exp.contains());
		});

	});

	describe('containsAl()', () => {

		xit('Should contain all elements', () => {});
		xit('Should NOT contain at least one element', () => {});

	});

	describe('containsWhere()', () => {

		xit('Should contain an element with condition', () => {});
		xit('Should NOT contain an element with condition', () => {});

	});

	describe('remove()', () => {

		xit('Should remove an element', () => {});
		xit('Should NOT remove an element', () => {});

	});

	describe('removeAll()', () => {

		xit('Should remove all the elements', () => {});
		xit('Should NOT remove all the elements', () => {});

	});

	describe('removeBy()', () => {

		xit('Should remove elments by predicate', () => {});
		xit('Should NOT remove elements by predicate', () => {});

	});

	describe('sort()', () => {

		xit('Should sort by comparator', () => {});
		xit('Should NOT sort', () => {});

	});

	describe('iterator()', () => {

		xit('Should get an iterator from collection', () => {});

	});

	describe('reset()', () => {

		it('Should reset the collection', () => {
			const exp = Collection.new();
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.reset, exp)
				.returns(exp);

			exp.addAll([1,2], { silent: true });
			assert.equal(2, exp.size());

			exp.reset();
			assert.equal(0, exp.size());
		});

	});

	describe('size()', () => {

		it('Should get the size of the collection', () => {
			assert.equal(0, Collection.new().size());
			assert.equal(2, Collection.new([1,2]).size());
		});

	});

	describe('isEmpty()', () => {

		it('Should be empty', () => {
			assert.isTrue(Collection.new().isEmpty());
		});

		it('Should NOT be empty', () => {
			assert.isFalse(Collection.new([1]).isEmpty());
		});

	});

	describe('hasInterface()', () => {

		it('Should have interface defined', () => {
			const exp = Collection.new([{ env: 'staging' }, { env: 'production' }], { interface: Command });
			assert.isTrue(exp.hasInterface());
		});

		it('Should NOT have interface defined', () => {
			const exp = Collection.new([]);
			assert.isFalse(exp.hasInterface());
		});

	});

	describe('toJSON()', () => {

		it('Should get a json representation (without interface)', () => {
			const exp = Collection.new([1,2,'value']).toJSON();
			assert.isArray(exp);
			assert.equal(3, exp.length);
			assert.equal('value', exp[2]);
		});

		it('Should get a json representation (with interface)', () => {
			const exp = Collection.new([{ env: 'staging' }, { env: 'production' }], { interface: Command }).toJSON();
			assert.isArray(exp);
			assert.equal(2, exp.length);
			assert.equal('production', exp[1].env);
		});

	});

});
