/**
*	@module bin
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import SquareBox from 'bin/sqbox';
import Commander from 'visitors/commander';

describe('bin.SquareBox', function() {

	before(() => {
		this.cwd = path.resolve(process.cwd());
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		if(this.sqbox) this.mockProto = this.sandbox.mock(this.sqbox);
		this.mockCommander = this.sandbox.mock(Commander.prototype);
		this.input = [process.argv[0], this.cwd];
	});

	afterEach(() => {
		if(this.mockProto) this.mockProto.verify();
		this.mockCommander.verify();

		this.sandbox.restore();

		delete this.mockCommander;
		delete this.mockProto;
		delete this.input;
	});

	after(() => {
		delete this.cwd;
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get an instance', () => {
			this.sqbox = require('bin/sqbox').default.new();
			assert.instanceOf(this.sqbox, SquareBox);
		});

	});

	describe('static->run()', () => {

		it('Should run the command', () => {
			this.input = this.input.concat([
				'sqbox',
				'bundle',
				'--config', 'test/specs/.sqboxrc',
				'--s', './source/**',
				'--x', './source/dependencies/**,./source/package/**',
				'--e', '.js,.es6',
				'--a', 'common:./path/common',
				'--t', 'add>umd:./dist/umd,other>cjs:./dist/cjs',
				'--lv', 'silent'
			]);

			this.mockCommander.expects('_args')
				.once()
				.returns(this.input);

			assert.instanceOf(this.sqbox.run(), SquareBox);
		});

	});

});
