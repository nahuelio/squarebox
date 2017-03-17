/**
*	Config Example using module.exports
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
module.exports = {
	source: {
		scan: './src/**',
		exclude: ['./src/dependencies/**'],
		extensions: ['.js', '.es6', '.es'],
		alias: {
			common: 'shared/common',
			libraries: 'libs'
		}
	},
	target: {
		global: {
			destination: './dist/global',
			format: 'ifie'
		},
		umd: {
			destination: './dist/umd',
			format: 'umd'
		},
		cjs: {
			destination: './dist/cjs',
			format: 'cjs'
		},
		amd: {
			destination: './dist/amd',
			format: 'amd'
		}
	},
	logLevel: 'debug'
};
