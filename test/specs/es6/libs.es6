/**
*	@sqbox({ name: "libs" })
**/
import 'libs/cjs-lib';
import CommonJsLib from 'libs/cjs-lib';
import * as AmdLib from 'libs/amd-lib';
import { component } from 'libs/other';
import First, { A, B as C } from 'libs/combination';
import Second, { B as C } from 'libs/alias';
