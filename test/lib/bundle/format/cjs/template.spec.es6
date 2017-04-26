/**
*	@module bundle.format.cjs
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
//import * as Cjs from 'bundle/format/cjs/template';

describe.skip('bundle.format.cjs.Template', function() {

	before(() => {
		this.input = {
			name: 'bundle',
			dependencies: ['react', 'common/module'],
			ids: ['React', 'Module'],
			content: 'return MyModule;'
		};
	});

	after(() => {
		delete this.input;
	});

	describe('template()', () => {

		it('Should output amd imports', () => {
			//const result = Cjs.imports(this.input);
			//console.log(result);
			// assert.include(result, `/** <${this.input.name}> **/`);
			// assert.include(result, `define(`);
			// assert.include(result, `return MyModule;`);
		});

	});

});
