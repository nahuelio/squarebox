/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Collection from 'commands/util/adt/collection';
import Command from 'commands/command';
import Iterator from 'commands/util/adt/iterator';

describe('commands.util.adt.Collection', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockStatic = this.sandbox.mock(Collection);
		this.mockCollection = this.sandbox.mock(Collection.prototype);
	});

	afterEach(() => {
		this.mockStatic.verify();
		this.mockCollection.verify();

		this.sandbox.restore();

		delete this.mockStatic;
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
				.withArgs(Collection.events.add, exp, sinon.match.instanceOf(Command))
				.returns(sinon.match.instanceOf(Command));

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

		it('Should add a new element (with custom new instanciation)', () => {
			const toAdd = { env: 'production' };
			const _new = (attrs) => new Command({ env: 'prod' });
			const spyNew = this.sandbox.spy(_new);
			const exp = Collection.new([], { interface: Command });
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.add, exp, sinon.match.instanceOf(Command))
				.returns(sinon.match.instanceOf(Command));

			assert.instanceOf(exp.add(toAdd, { new: spyNew }), Command);
			assert.equal(true, spyNew.calledOnce);
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

	describe('containsAll()', () => {

		it('Should contain all elements', () => {
			const exp = Collection.new([{ option: 1 }, { option: 2 }, { option: 3 }]);

			assert.isTrue(exp.containsAll([{ option: 1 }, { option: 3 }]));
			assert.isFalse(exp.containsAll([{ option: 1 }, { option: 2 }, { option: 3 }, { option: 4 }]));
		});

		it('Should NOT contain at least one element', () => {
			const exp = Collection.new([{ option: 1 }, { option: 2 }, { option: 3 }]);

			assert.isFalse(exp.containsAll([{ option: 1 }, { value: 2 }]));
			assert.isFalse(exp.containsAll([]));
			assert.isFalse(exp.containsAll());
		});

	});

	describe('containsWhere()', () => {

		it('Should contain an element with condition', () => {
			const exp = Collection.new([{ prop: 'A' }, { prop: 'B' }]);
			assert.isTrue(exp.containsWhere({ prop: 'B' }));
			assert.isTrue(exp.containsWhere());
		});

		it('Should NOT contain an element with condition', () => {
			const exp = Collection.new([{ prop: 'A' }, { prop: 'B' }]);
			assert.isFalse(exp.containsWhere({ prop: 'C' }));
		});

	});

	describe('removeAt()', () => {

		it('Should remove an element at index (without interface)', () => {
			const toRemove = 2;
			const exp = Collection.new([1,2,3]);
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.remove, exp, [toRemove])
				.returns(exp);

			assert.equal(1, exp.removeAt(1));
			assert.equal(2, exp.size());
			assert.equal(3, exp.get(1));
		});

		it('Should remove an element at index (with interface)', () => {
			const exp = Collection.new([{ env: 'staging' }, { env: 'production' }], { interface: Command });
			const toRemove = exp.get(1);
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.remove, exp, [toRemove])
				.returns(exp);

			assert.equal(1, exp.removeAt(1));
			assert.equal(1, exp.size());
			assert.notEqual(toRemove.toJSON(), exp.get(0).toJSON());
		});

		it('Should NOT remove an element at index (default index)', () => {
			const exp = Collection.new();
			const expEmit = this.mockCollection.expects('emit').never();
			assert.isNull(exp.removeAt());
		});

		it('Should NOT remove an element at index (index not a number)', () => {
			const exp = Collection.new();
			const expEmit = this.mockCollection.expects('emit').never();
			assert.isNull(exp.removeAt('hello'));
		});

		it('Should NOT remove an element at index (index is greater that size - 1)', () => {
			const exp = Collection.new([1,2]);
			const expEmit = this.mockCollection.expects('emit').never();
			assert.isNull(exp.removeAt(2));
		});

	});

	describe('remove()', () => {

		it('Should remove an element (without interface)', () => {
			const toRemove = 2;
			const exp = Collection.new([1,2,3]);
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.remove, exp, [toRemove])
				.returns(exp);

			assert.equal(toRemove, exp.remove(toRemove));
			assert.equal(2, exp.size());
			assert.equal(3, exp.get(1));
		});

		it('Should remove an element (with interface)', () => {
			const exp = Collection.new([{ env: 'staging' }, { env: 'production' }], { interface: Command });
			const toRemove = exp.get(1);
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.remove, exp, [toRemove])
				.returns(exp);

			assert.equal(toRemove, exp.remove(toRemove));
			assert.equal(1, exp.size());
			assert.notEqual(toRemove, exp.get(0));
		});

		it('Should NOT remove an element (element is invalid)', () => {
			const exp = Collection.new([1,2]);
			const expEmit = this.mockCollection.expects('emit').never();
			assert.isNull(exp.remove());
		});


	});

	describe('removeAll()', () => {

		it('Should remove all the elements', () => {
			const toRemove = [1,2];
			const exp = Collection.new([1,2,3]);
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.removeall, exp, toRemove)
				.returns(exp);

			assert.instanceOf(exp.removeAll(toRemove), Collection);
			assert.isFalse(exp.isEmpty());
			assert.equal(1, exp.size());
			assert.equal(3, exp.get(0));
		});

		it('Should remove a few elements (matching)', () => {
			const toRemove = [1,5,2];
			const exp = Collection.new([1,2,3]);
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.removeall, exp, [1,2])
				.returns(exp);

			assert.instanceOf(exp.removeAll(toRemove), Collection);
			assert.isFalse(exp.isEmpty());
			assert.equal(1, exp.size());
			assert.equal(3, exp.get(0));
		});

		it('Should NOT remove all the elements', () => {
			const toRemove = [4,5];
			const exp = Collection.new([1,2,3]);
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.removeall, exp, [])
				.returns(exp);

			assert.instanceOf(exp.removeAll(toRemove), Collection);
			assert.isFalse(exp.isEmpty());
			assert.equal(3, exp.size());
			assert.equal(1, exp.get(0));
		});

		it('Should NOT remove all the elements (elements not an array)', () => {
			const toRemove = { invalid: 1 };
			const exp = Collection.new([1,2,3]);
			const expEmit = this.mockCollection.expects('emit').never();

			assert.instanceOf(exp.removeAll(toRemove), Collection);
			assert.instanceOf(exp.removeAll(), Collection);

			assert.isFalse(exp.isEmpty());
			assert.equal(3, exp.size());
		});

	});

	describe('removeBy()', () => {

		it('Should remove elments by predicate', () => {
			const predicate = (e) => (e.env === 'stage' || e.env === 'dev');
			let spyPredicate = this.sandbox.spy(predicate);
			const exp = Collection.new([{ env: 'stage' }, { env: 'dev' }, { env: 'prod' }], { interface: Command });
			const expEmit = this.mockCollection.expects('emit')
				.exactly(2)
				.withArgs(Collection.events.remove, exp, [sinon.match.instanceOf(Command)])
				.returns(sinon.match.instanceOf(Command));

			assert.instanceOf(exp.removeBy(spyPredicate), Collection);
			assert.equal(1, exp.size());
			assert.equal('prod', exp.get(0).env);
			assert.equal(true, spyPredicate.calledThrice);
		});

		it('Should NOT remove elements by predicate', () => {
			const predicate = (v) => v === 3;
			let spyPredicate = this.sandbox.spy(predicate);
			const exp = Collection.new([1,2]);
			const expEmit = this.mockCollection.expects('emit').never();

			assert.instanceOf(exp.removeBy(spyPredicate), Collection);
			assert.equal(2, exp.size());
			assert.equal(true, spyPredicate.calledTwice);
		});

		it('Should NOT remove elements by predicate (no predicate)', () => {
			const exp = Collection.new([1,2]);
			const expEmit = this.mockCollection.expects('emit').never();

			assert.instanceOf(exp.removeBy(), Collection);
			assert.equal(2, exp.size());
		});

	});

	describe('sort()', () => {

		it('Should sort by comparator', () => {
			const exp = Collection.new([{ v: 3 }, { v: 1 }, { v: 2 }]);
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.sort, exp)
				.returns(exp);

			exp.sort((a, b) => (a.v - b.v));

			assert.equal(1, exp.get(0).v);
			assert.equal(2, exp.get(1).v);
			assert.equal(3, exp.get(2).v);
		});

		it('Should sort using default', () => {
			const exp = Collection.new(['Hello', '1 Hello', '2 World', 'World']);
			const expEmit = this.mockCollection.expects('emit')
				.once()
				.withArgs(Collection.events.sort, exp)
				.returns(exp);

			exp.sort();

			assert.equal('1 Hello', exp.get(0));
			assert.equal('2 World', exp.get(1));
			assert.equal('Hello', exp.get(2));
			assert.equal('World', exp.get(3));
		});

	});

	describe('iterator()', () => {

		it('Should get an iterator from collection', () => {
			assert.instanceOf(Collection.new([1,2,3]).iterator(), Iterator);
		});

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

	describe('static->_aggregate()', () => {

		it('Should NOT aggregate underscore methods (already implemented)', () => {
			const expUNDERSCORE = this.mockStatic.expects('UNDERSCORE')
				.once()
				.returns(['remove']);

			assert.typeOf(Collection._aggregate(), 'Function');
		});

		it('Should NOT aggregate underscore methods (not as part of underscore)', () => {
			const expUNDERSCORE = this.mockStatic.expects('UNDERSCORE')
				.once()
				.returns(['unexistent']);

			assert.typeOf(Collection._aggregate(), 'Function');
		});

	});

});
