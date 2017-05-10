/**
*	@module bundle.types.import
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import _s from 'underscore.string';
import Collection from 'util/adt/collection';

/**
*	Import Declaration Handler
*	Captures expressions like:
*		- import [Identifier] from [path];
*		- import [{ Identifier, ... }] from [path];
*		- import * as [Identifier] from [path];
*	@public
*	@param {bundle.types.import.Import} type import type reference
*	@param {util.adt.Collection} imports collection of import declarations
*	@return {util.adt.Collection}
**/
export const onImport = (type, imports) => {
	//imports.reduce(_.bind(onImportIdentifier, this, type), Collection.new());
};

/**
*	Import Identifier Declaration Handler
*	Captures expressions within ImportDeclarations such us:
*		- [Identifier]
*		- [{ Identifier, ... }]
*		- * as [Identifier]
*	@public
*	@param {Function} query astq query function
*	@param {util.adt.Collection} memo memoized collection of identifiers to augment
*	@param {astq.Node} declaration current import declaration node reference
*	@return {util.adt.Collection}
**/
export const onImportIdentifier = (type, memo, declaration) => {
	console.log(declaration);
	//query(declaration, )
};

/**
*	Import Identifier Declaration Handler
*	Captures expressions within ImportDeclarations such us:
*		- [Identifier]
*	@public
*	@param {Function} query astq query function
*	@param {util.adt.Collection} memo memoized collection of identifiers to augment
*	@param {astq.Node} declaration current import declaration node reference
*	@return {util.adt.Collection}
**/
export const onImportPath = (query, memo, declaration) => {

};
