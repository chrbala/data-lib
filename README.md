# single-schema

single-schema is a library that allows you to describe the shape of your data, then use the data shape in various ways via plugins. It's designed primarily for complex data shapes with a deep hierarchy.


### Word of warning
This library is a work in progress and the various portions have different levels of API stability. The way the schema is described will likely stay the same, but the rest of the API is subject to change.

There is reasonbly good test coverage, but I imagine there are bugs that I haven't hit yet. In particular, there are likely parts that *work* but would be more useful with alternate logic.

Because of the current unstability, minor releases in this package before it hits 1.0 will have breaking changes that will likely require changes to run without errors. Minor could be changes as significant as moving files or changing exports.

Patch fixes should still run without changes, but may change the logic in such a way that it breaks your code anyway. An example of this would be changing the way a module handles the difference between ``{key: undefined}``, ``{key: null}``, and ``{}``.

The upside of this situation is that I'm more likely to consider breaking changes if they make sense to merge in. In any case, I recommend that you use the exact version of this library in your package.json.

*Also, it's fairly likely there are minor mistakes in the docs here at this point. File an issue if you find something that seems off!*

## When would I need to describe complex data shapes?
* Creating browser inputs to send to your server
* Validating leaf nodes (e.g. text inputs) in the browser
* Validating endpoint inputs on the server

## What's it look like?

### Creating the schema

Creating a schema has two main parts:  
1. describing your leaf nodes  
2. using the leaf nodes in the schema

```javascript
/* schema.js */

// details on setup below
import { combine, array } from './setup';

const string = {
	validate: value => typeof value == 'string'
		? null
		: `Expected string, got ${typeof value}`,
	coerce: value => String(value),
};

const person = combine({
	name: string,
});

const people = array(person);

export const family = combine({
	adults: people,
	children: people,
});
```

### Using the schema
 
```javascript
/* app.js */

import { family } from './schema';

// returns: null
family.validate({
	adults: ['Bob Saget'],
	children: [],
}); 

const invalidFamily = {
	adults: [123],
	children: [],
};

/*
returns: { 
	adults: ['Expected string, got number'] 
}
*/
family.validate(invalidFamily);

/* 
returns: {
	adults: ['123'],
	children: [],
};
*/
const coercedInvalidFamily = family.coerce({
	adults: [123],
	children: [],
}); 

// returns: null
family.validate(coercedInvalidFamily);
```

### Setting up the schema

single-schema is modular, so we need to set it up with the modules we're using. 

```javascript
/* setup.js */

import create from 'single-schema';

import Coercer from 'single-schema/flatteners/coercer';
import Validator from 'single-schema/flatteners/validator';

const flatteners = {
	validate: Validator(),
	coerce: Coercer(),
};

const { combine, array, map, and, maybe } = create(flatteners);

export {
	combine,
	array, 
	map, 
	and, 
	maybe,
};
```

## Taxonomy
Reducers: dictate the structure of the schema - leaf nodes are reducers as well  
Operators: act on 1 or more reducers, returning a single reducer  
Modules: provide the concrete functionality of the schema  
Meta-modules: act on modules to modify their functionality

## Operators
Operators provide the structure in a schema. Operators work differently depending on the module context that they are run in, so this section simply describes what the operator represents. Some operators/module combinations are not supported.

* combine: An object that has preset keys with varying types
* array: An object with integer keys and a length
* map: An object that has arbitrary keys associated with a single type
* and: Combines two or more operators into one
* maybe: Represents a value that may be null or undefined. Maybe allows for recursive data types.

## Modules

single-schama ships with 6 modules. Ultimately, I'd like to have a public API for modules, but I have some planned changes to the internals of the library before opening it up.

Note that most of the examples for the modules are fairly flat, but the schemas can have arbitrary depth. See the complete use cases for more complex examples.

* [Coercer](src/flatteners/coercer/README.md): Attemts to transform invalid data to data compliant with the schema
* [Validator](src/flatteners/validator/README.md): Checks if data is compliant with the schema
* [Graphql](src/flatteners/graphql/README.md): Creates a graphql schema
* [Proptype](src/flatteners/proptype/README.md): Creates a React PropType
* [Shaper](src/flatteners/shaper/README.md): Creates an initial data object for the schema
* [Updater](src/flatteners/updater/README.md): Helps update state immutably

## Meta-modules

Right now there is only one meta-module: [Async](src/metaFlatteners/async/README.md)

## Complete use case examples
There are some fairly complete use-case examples in the examples folder:

* examples/react is a simple react example that uses Proptype and Updater
* examples/full-stack is a thorough example that uses all of the modules. It includes relay and graphql, so you'd probably want to be familiar with those before reading through it.

