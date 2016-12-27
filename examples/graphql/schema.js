// @flow

import { GraphQLSchema } from 'graphql';

import { combineReducers } from '../../src';
import { store } from '../../src/defaultSelection';
import { person, family } from '../data';

const exampleFamily = {
	adults: [ {name: 'Bob'}, {name: 'Susan'} ],
	children: [ {name: 'Larry'}, {name: 'Curly'}, {name: 'Moe'} ],
};

person.graphql({
	name: 'person',
});

family.graphql({
	name: 'family',
}, {
	resolve: () => exampleFamily,
});

combineReducers({
	family,
}).graphql({
	name: 'query',
});

export default new GraphQLSchema({
	query: store.get('query'),
});
