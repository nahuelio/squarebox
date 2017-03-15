/**
*	Config Example using module.exports
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
module.exports = {
	source: {
		scan: './src/**',
		extensions: ['.js', '.es6', '.es'],
		alias: {
			common: 'shared/common',
			libraries: 'libs'
		}
	},
	target: [{
		destination: './dist/global',
		format: 'ifie'
	}, {
		destination: './dist/cjs',
		format: 'cjs'
	}, {
		destination: './dist/umd',
		format: 'umd'
	}, {
		destination: './dist/amd',
		format: 'amd'
	}],
	logLevel: 'debug'
};
