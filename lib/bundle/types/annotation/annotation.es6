/**
*	@module bundle.types.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Type from 'bundle/types/type';
import logger from 'util/logger/logger';

/**
*	Class Annotation
*	@extends {bundle.types.Type}
**/
class Annotation extends Type {

	/**
	*	Annotation Read strategy
	*	@public
	*	@override
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Promise}
	**/
	read(resolve, reject) {
		return resolve(this);
	}

}

export default Annotation;
