/**
*	@module commands.bin
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Command from 'commands/command';
import extend from 'extend';
import yargs from 'yargs';

/**
*	Class SquareBox
*	@extends commands.Command
**/
class SquareBox extends Command {

	/**
	*	Command Defaults
	*	@static
	*	@type {Object}
	**/
	static defaults = extend(true, Command.defaults, {
		'config': '.squarebox.json',
		'source-scan': './src',
		'source-extensions': ['.js', '.es6', '.es'],
		'source-alias': ,
		'target-destination': './dist',
		'target-format': 'ifie'
	});

	/**
	*	Command options
	*	@static
	*	@type {Array}
	**/
	static options = Command.options.concat([
		'config',
		'source-scan',
		'source-extensions'
		'source-alias',
		'target-destination',
		'target-format'
	]);

	/**
	*	Setup Yargs
	*	@static
	*	@override
	*	@return
	**/
	static setup() {
		Command.setup();
		return this;
	}

	/**
	*	Static Run
	*	@static
	*	@return commands.bin.SquareBox
	**/
	static run() {
		return this.setup().new(this.args());
	}

}

export default SquareBox.run();
