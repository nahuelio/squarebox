/**
*	@module help
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Command from 'command';

/**
*	Class Clean
*	@extends {Command}
**/
class Clean extends Command {

	/**
	*	Run
	*	@public
	*	@override
	*	@return {help.Clean}
	**/
	run() {
		// TODO
		console.log('Help.run()...');
		return super.run();
	}

}

export default Clean;
