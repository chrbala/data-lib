// @flow

type IsObjectType = (data: *) => boolean;
export const isObject: IsObjectType = 
	data => data === Object(data);

export const freeze = (obj: *) => 
	process.env.NODE_ENV == 'production'
		? obj
		: Object.freeze(obj)
	;

export const isFrozen = (obj: *) => 
	process.env.NODE_ENV != 'production' && Object.isFrozen(obj)
;

type AnyType = *;

export const mapObj = (obj: {}, cb: (value: *, key: string) => AnyType) => {
	const out: {[key: string]: *} = {};
	for (const key in obj)
		out[key] = cb(obj[key], key);
	return out;
};
