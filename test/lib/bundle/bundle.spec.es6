/**
*	@module bundle
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Bundle from 'bundle/bundle';

describe('bundle.Bundle', function() {

	before(() => {
		this.params = {
			scan: './test/specs/es6/**',
			extensions: ['.js', '.es6'],
			alias: { common: 'common' },
			target: {
				global: { destination: './test/specs/dist/global', format: 'ifie' },
			 	umd: { destination: './test/specs/dist/umd', format: 'umd' },
				cjs: { destination: './test/specs/dist/cjs', format: 'cjs' },
				amd: { destination: './test/specs/dist/amd', format: 'amd' }
			}
		};
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockInstance = this.sandbox.mock(Bundle);
	});

	afterEach(() => {
		this.mockInstance.verify();

		this.sandbox.restore();

		delete this.mockInstance;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			this.bundle = Bundle.new(this.params);
			assert.instanceOf(this.bundle, Bundle);
		});

	});

	describe('run()', () => {

		it('Should execute command run', () => {
			// TODO: stubPromise for read and writer on method run
			this.bundle.run();
		});

	});

	describe('toJSON()', () => {

		it('Should return a json representation', () => {
			const exp = this.bundle.toJSON();
			assert.property(exp, 'cwd');
			assert.property(exp, 'scan');
			assert.property(exp, 'target');
		});

	});

});
