// @flow

import type { AllReducerType, ReducerType } from '../../shared/types';
import type { ScopeType } from './types';

const reduce: ReducerType<*> = (children: AllReducerType<*>) => 
	({subscribe: scopedSubscribe, getState: scopedGetstate}: ScopeType) => {
		const update = (value: *) => scopedSubscribe(value);
		for (const child in children) {
			const getState = () => {
				const scopedState = scopedGetstate();
				return scopedState === undefined || scopedState === null
					? scopedState
					: scopedState[child]
				;
			};
			const subscribe = data => 
				scopedSubscribe({...scopedGetstate(), [child]: data});
			const childStore = children[child] 
				? children[child] 
				: reduce({}, {})
			;
			const keyName = child == 'name' ? 'Name' : child;
			update[keyName] = childStore({getState, subscribe});
		}
		return update;
	}
;

export default reduce;
