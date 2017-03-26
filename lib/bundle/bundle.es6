/**
*	@module bundle
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Command from 'command';

/**
*	Class Bundle
*	@extends {Command}
**/
class Bundle extends Command {

	/**
	*	Run
	*	@public
	*	@override
	*	@return {bundle.Bundle}
	**/
	run() {
		//console.log(this.toJSON());
		return super.run();
	}

}

export default Bundle;
