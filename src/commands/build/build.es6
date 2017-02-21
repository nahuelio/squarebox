/**
*	Squarebox Build
*	@module Build
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Package from '../../../package.json';
import yargs from 'yargs';
import { EventEmitter } from 'events';

/**
*	Class Build
*	@class Build
*	@extends events.EventEmiter
**/
class Build extends EventEmitter {

	/**
	*	Constructor
	*	@constructor
	*	@param [...args] {Any} arguments
	*	@return Build
	**/
	constructor(...args) {
		super();
		return this;
	}

	/**
	*	Static Build Run
	*	@static
	*	@param [...args] {Any} arguments
	*	@return Build
	**/
	static run(...args) {
		return new this(...args);
	}

}

export default Build.run();
