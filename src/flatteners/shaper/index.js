// @flow

import reduce from './reduce';
import array from './array';
import maybe from './maybe';

import * as _leaves from './leaves';
export const leaves = _leaves;

import type { FlattenerType } from '../../shared/types';

type OptionsType = {
	leafNode: *,
};

type ShaperType = (options: *) => FlattenerType<*>;

const Shaper: ShaperType = ({leafNode = undefined}: OptionsType = {}) => ({
	reduce: reduce({leafNode}),
	array,
	maybe,
});

export default Shaper;
