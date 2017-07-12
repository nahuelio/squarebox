## Squarebox


[![Build Status](https://travis-ci.org/nahuelio/squarebox.svg?branch=master)](https://travis-ci.org/nahuelio/squarebox)
[![Coverage Status](https://coveralls.io/repos/github/nahuelio/squarebox/badge.svg)](https://coveralls.io/github/nahuelio/squarebox)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sqbox/General?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg?style=flat)]()
[![Version](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/mit-license.php)
[![GitHub stars](https://img.shields.io/github/stars/nahuelio/squarebox.svg?style=social&label=Stars)]()

#### Introduction

Experimental ES6/CommonJS/AMD Module Bundler

#### Installation

```npm install [-g] squarebox```

### Usage

```sqbox [command] [options]```

#### Commands

* **help** - Global Help
* **bundle help** - Contextual help for command ```bundle```
* **bundle** - Bundles your project
	* Options
		* [-c, --config] (sqbox.js, .sqboxrc, or a remote url) | Default: [currentDirectory]/.sqboxrc
		* TODO Overrides...
* **clean** - Clean destination folder
	* Options
		* ...TODO
* **graph** - Generates a graphical report of your current bundling strategy
	* Options
		* ...TODO

#### Programmatic API

```
const sqbox = require('squarebox');
// Or ES6: import sqbox from 'squarebox';
sqbox.clean([opts])
	.bundle([config])
	.graph([opts]);
```

#### Official Documentation

```
TODO: Official Website / APIDocs
```

#### Contribute

```
TODO
```

#### License

```
TODO
```

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://nahuel.io)
by [Nahuel IO](http://nahuel.io)
