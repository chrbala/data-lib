// @flow

import createCombineReducers from '../../createCombineReducers';
import Validator from './';
import { 
	EXTRA_KEY_TEXT, 
	EXPECTED_OBJECT, 
} from './strings';

const combineReducers = createCombineReducers({
	validate: Validator(),
});

const IS_STRING_ERROR = 'Must be string';
const isString = {
	validate: value => typeof value == 'string'
	? null
	: IS_STRING_ERROR,
};

const { validate } = combineReducers({
	key: isString,
});

it('Basic passing validation', () => {
	const actual = validate({
		key: 'value',
	});
	const expected = null;
	expect(actual).toEqual(expected);
});

it('Basic failing validation', () => {
	const actual = validate({
		key: 123,
	});
	const expected = {
		key: IS_STRING_ERROR,
	};
	expect(actual).toEqual(expected);
});

it('Unexpected property', () => {
	const actual = validate({
		key: 'value',
		key2: 'value',
	});
	const expected = {
		key2: EXTRA_KEY_TEXT,
	};
	expect(actual).toEqual(expected);
});

it('Missing property fails', () => {
	const actual = validate({

	});
	const expected = {
		key: IS_STRING_ERROR,
	};
	expect(actual).toEqual(expected);
});

it('Top level undefined does not pass', () => {
	const actual = validate(undefined);
	const expected = EXPECTED_OBJECT;
	expect(actual).toEqual(expected);
});

it('Top level null does not pass', () => {
	const actual = validate(null);
	const expected = EXPECTED_OBJECT;
	expect(actual).toEqual(expected);
});
