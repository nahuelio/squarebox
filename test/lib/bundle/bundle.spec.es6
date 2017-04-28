/**
*	@module bundle
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Bundle from 'bundle/bundle';

describe('bundle.Bundle', function() {

	before(() => {
		this.params = {
			scan: './test/specs/es6',
			extensions: ['.js', '.es6'],
			exclude: [],
			external: ['react'],
			alias: { common: 'common' },
			external: ['jquery'],
			target: {
				iife: { destination: './test/specs/dist/iife', format: 'iife' },
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

		it('Should execute command run over specs/es6', () => {
			this.bundle.run();
		});

		xit('Should execute command run over specs/amd', () => {});
		xit('Should execute command run over specs/cjs', () => {});
		xit('Should execute command run over specs/iife', () => {});
		xit('Should execute command run over specs/umd', () => {});

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
