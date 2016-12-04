// @flow

type ErrorType = string | {[key: string]: ErrorType};
type SuccessType = null;
type ReturnType = ErrorType | SuccessType;

/* Wrap section */ 
const allOptions = {
	NON_NULL: 'NON_NULL',
	PERMISSIVE: 'PERMISSIVE',
};
type OptionType = $Keys<typeof allOptions>;
type SelectedOptionsType = {[key: OptionType]: boolean};

class Wrap<T> {
	options: SelectedOptionsType;
	value: T;

	constructor(_value: T, newOption: ?OptionType) {
		const { options, value } = Wrap.unwrap(_value);
		this.value = value;
		this.options = newOption ? {...options, [newOption]: true} : options;
	}

	static unwrap(value: * | Wrap<*>): { value: *, options: SelectedOptionsType} {
		if (value instanceof Wrap)
			return {value: value.value, options: value.options};
		return { value, options: {} };
	}
}

type ReducerType = Wrap<*> | (data: *) => ReturnType;

export const NonNull: ReducerType => Wrap<ReducerType> = 
	value => new Wrap(value, allOptions.NON_NULL);

export const Permissive: * => Wrap<*> = 
	(value: *) => new Wrap(value, allOptions.PERMISSIVE);

/* Reducer section */
export const EXTRA_KEY_TEXT = 'unexpected property';
export const MISSING_KEY_TEXT = 'missing property';
export const PROMISE_NOT_PERCOLATED_ERROR = 
	'Asynchronous validators must be used with CombineReducersAsyncType'
;

type CombineReducersType = 
	(isAsync: boolean) =>
		(props: {[key: string]: ReducerType}) => 
			(data: *) => ReturnType
;

const isPromise = value => value === Promise.resolve(value);
const checkIfErrors = output => Object.keys(output).length ? output : null;

const combineReducersBuilder: CombineReducersType = isAsync => _props => {
	const { options: propsOptions, value: props } = Wrap.unwrap(_props);

	if (!isAsync)
		for (const key in props) {
			const { value: reduce } = Wrap.unwrap(props[key]);
			const initialValue = reduce(undefined);
			if (isPromise(initialValue))
				throw new Error(PROMISE_NOT_PERCOLATED_ERROR);
		}

	return data => {
		if (!data)
			return isAsync ? Promise.resolve(null) : null;

		const errors = {};
		const missing = {};
		const extra = {};

		for (const key in props) {
			const { options: reducerOptions, value: reduce } = Wrap.unwrap(props[key]);
			if (reducerOptions[allOptions.NON_NULL] && !data[key])
				missing[key] = MISSING_KEY_TEXT;
			else if (key in data) {
				const error = reduce(data[key]);
				if (error !== null) 
					errors[key] = error;
			}
		}

		if (!propsOptions[allOptions.PERMISSIVE])
			for (const key in data)
				if (!props[key])
					extra[key] = EXTRA_KEY_TEXT;

		const output = { ...errors, ...missing, ...extra };

		if (isAsync)
			return (async () => {
				const asyncOutput = {};
				for (const key in output) {
					const error = await output[key];
					if (error !== null)
						asyncOutput[key] = error;
				}
				return checkIfErrors(asyncOutput);
			})();

		return checkIfErrors(output);
	};
};

export const combineReducers = combineReducersBuilder(false);
export const combineReducersAsync = combineReducersBuilder(true);
