/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Iterator from 'commands/util/adt/iterator';

describe('commands.util.adt.Iterator', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockIterator = this.sandbox.mock(Iterator.prototype);
	});

	afterEach(() => {
		this.sandbox.restore();
		delete this.mockIterator;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('#constructor', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(Iterator.new(), Iterator);
			assert.instanceOf(Iterator.new({}), Iterator);
		});

		it('Should get a new instance with elements', () => {
			const exp = Iterator.new([1,2]);
			assert.instanceOf(exp, Iterator);
			assert.isTrue(exp._collection.length === 2);
		});

	});

	describe('#_valid()', () => {

		it('Should return true (valid element)', () => {
			const exp = Iterator.new();
			assert.isTrue(exp._valid([1,2,3]));
		});

		it('Should return false (invalid element)', () => {
			const exp = Iterator.new();
			assert.isFalse(exp._valid());
			assert.isFalse(exp._valid({ key: 1 }));
		});

	});

	describe('#set()', () => {

		it('Should set the iterator', () => {
			const exp = Iterator.new();
			const expEmit = this.mockIterator.expects('emit')
				.once()
				.withArgs(Iterator.events.set, exp)
				.returns(exp);

			exp.set([1,2,3]);

			this.mockIterator.verify();
		});

		it('Should NOT set the iterator', () => {
			const exp = Iterator.new();
			const expEmit = this.mockIterator.expects('emit').never();

			exp.set().set([]).set([1,2,3], { silent: true });

			this.mockIterator.verify();
		});

	});

	describe('#hasNext()', () => {

		it('Should return true and false', () => {
			const exp = Iterator.new([1,2]);
			assert.isTrue(exp.hasNext());
			exp.next();
			assert.isTrue(exp.hasNext());
			exp.next();
			assert.isFalse(exp.hasNext());
		});

	});

	describe('#next()', () => {

		it('Should return next element', () => {
			const exp = Iterator.new([1,2]);
			assert.isNotNull(exp.next());
			assert.isNotNull(exp.next());
			assert.isNull(exp.next());
		});

	});

	describe('#rewind()', () => {

		it('Should rewind the iterator (pointer to the begin of the iterator)', () => {
			const exp = Iterator.new([1,2]);
			exp.next();
			exp.next();
			assert.isNull(exp.next());
			assert.isFalse(exp.hasNext());
			exp.rewind();
			assert.isNotNull(exp.next());
			assert.isTrue(exp.hasNext());
		});

	});

	describe('#remove()', () => {

		it('Should remove the current element by the pointer', () => {
			const exp = Iterator.new([1,2,3]);
			const expEmit = this.mockIterator.expects('emit')
				.once()
				.withArgs(Iterator.events.remove, exp)
				.returns(exp);

			exp.remove();
			assert.equal(2, exp._collection.length);

			this.mockIterator.verify();
		});

		it('Should NOT remove the current element (collection is empty)', () => {
			const exp = Iterator.new();
			const expEmit = this.mockIterator.expects('emit').once();

			exp.remove();
			exp.set([1,2]);
			exp.remove({ silent: true });
			assert.isTrue(expEmit.calledWith(Iterator.events.set, exp));

			this.mockIterator.verify();
		});

	});

});
