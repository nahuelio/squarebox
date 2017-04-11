/**
*	@module bin
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import SquareBox from 'bin/sqbox';
import Commander from 'visitors/commander';
import Command from 'command';
import Graph from 'visualize/graph';
import Bundle from 'bundle/bundle';
import Clean from 'clean/clean';

describe('bin.SquareBox', function() {

	before(() => {
		this.cwd = path.resolve(process.cwd());
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(SquareBox.prototype);
		this.mockCommander = this.sandbox.mock(Commander.prototype);
		this.input = [process.argv[0], this.cwd];
	});

	afterEach(() => {
		this.mockProto.verify();
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
				'graph',
				'--config', 'test/specs/.sqboxrc',
				'--s', './source/**',
				'--x', './source/dependencies/**,./source/package/**',
				'--e', '.js,.es6',
				'--a', 'common:./path/common',
				'--t', 'add>umd:./dist/umd,other>cjs:./dist/cjs',
				'--lv', 'silent'
			]);

			const stubCommandAfter = this.sandbox.stub(Command.prototype, 'getParent', () => this.sqbox);

			const stubRun = (construct) => {
				return (resolve, reject) => {
					resolve({});
					return construct.prototype;
				};
			};

			const stubCleanRun = this.sandbox.stub(Clean.prototype, 'run', stubRun(Clean));
			const stubBundleRun = this.sandbox.stub(Bundle.prototype, 'run', stubRun(Bundle));
			const stubGraphRun = this.sandbox.stub(Graph.prototype, 'run', stubRun(Graph));

			const expArgs = this.mockCommander.expects('_args')
				.once()
				.returns(this.input);

			this.sqbox = SquareBox.run();
			assert.instanceOf(this.sqbox, SquareBox);

			Command.prototype.getParent.restore();
		});

	});

});
