// @flow

import type { AllFlattenerType, AllReducerType, AnyFnType } from './shared/types';

export default (operator: string) => 
	(flatteners: AllFlattenerType<*>) => (...reducers: Array<AllReducerType<*>>) => {
		const out: {[key: $Keys<typeof flatteners>]: AnyFnType} = {};
		for (const flattenerName in flatteners) {
			const scopedReducers = reducers.map(reducer => reducer[flattenerName]);
			const reducerContexts = reducers;
			
			const create = flatteners[flattenerName][operator];
			out[flattenerName] = create
				? create(...scopedReducers)(...reducerContexts)
				: () => console.warn(
						new Error(`${flattenerName}/${operator} was not found`)
					)
			;		
		}
		return out;
	};
