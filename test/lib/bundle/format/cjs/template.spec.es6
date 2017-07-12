/**
*	@module bundle.format.cjs
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
//import * as Cjs from 'bundle/format/cjs/template';

describe.skip('bundle.format.cjs.Template', function() {

	before(() => {
		this.input = {
			name: 'bundle',
			files: [],
			dependencies: ['react', 'common/module'],
			ids: ['React', 'Module'],
			content: 'return MyModule;'
		};
	});

	after(() => {
		delete this.input;
	});

});
