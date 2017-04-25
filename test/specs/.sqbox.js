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
		},
		external: ['jquery']
	},
	target: {
		global: {
			destination: './dist/global',
			format: 'iife'
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
	}
};
