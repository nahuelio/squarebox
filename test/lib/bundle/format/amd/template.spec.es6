/**
*	@module bundle.format.amd
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import * as Amd from 'bundle/format/amd/template';

describe('bundle.format.amd.Template', function() {

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
			const result = Amd.imports(this.input);
			assert.include(result, `/** <${this.input.name}> **/`);
			assert.include(result, `define(`);
			assert.include(result, `return MyModule;`);
		});

	});

});
