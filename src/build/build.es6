/**
*	@module build
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Package from '../../../package.json';
import Command from 'commands/command';
import _ from 'underscore';
import extend from 'extend';
import yargs from 'yargs';

/**
*	Class Build
*	@extends {command.Command}
**/
class Build extends Command {

	/**
	*	Build Run
	*	@public
	*	@override
	*	@return {build.Build}
	**/
	run() {
		return this;
	}

	/**
	*	Static Run
	*	@static
	*	@return {build.Build}
	**/
	static run() {
		return new this();
	}

}

export default Build.run();
