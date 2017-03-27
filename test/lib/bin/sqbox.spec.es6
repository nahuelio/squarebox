/**
*	@module bin
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import SquareBox from 'bin/sqbox';
import Commander from 'visitors/commander';
import Bundle from 'bundle/bundle';

describe('bin.SquareBox', function() {

	before(() => {
		this.cwd = path.resolve(process.cwd());
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(SquareBox.prototype);
		this.mockCommander = this.sandbox.mock(Commander.prototype);
		this.mockBundle = this.sandbox.mock(Bundle.prototype);
		this.input = [process.argv[0], this.cwd];
	});

	afterEach(() => {
		this.mockProto.verify();
		this.mockCommander.verify();
		this.mockBundle.verify();

		this.sandbox.restore();

		delete this.mockBundle;
		delete this.mockCommander;
		delete this.mockProto;
		delete this.input;
	});

	after(() => {
		delete this.cwd;
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should throw Error: Violation Error', () => {
			assert.throws(() => new SquareBox, 'Private Violation');
		});

	});

	describe('static->run()', () => {

		it('Should get a new instance and run it (with custom cwd)', () => {
			const expRun = this.mockProto.expects('run')
				.once()
				.returns(sinon.match.instanceOf(SquareBox));

			SquareBox.run(__dirname);
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

			const expBundleRun = this.mockBundle.expects('run')
				.once()
				.returns(sinon.match.instanceOf(Bundle));

			const expArgs = this.mockCommander.expects('_args')
				.once()
				.returns(this.input);

			this.sqbox = SquareBox.run();
			assert.instanceOf(this.sqbox, SquareBox);
		});

	});

});
