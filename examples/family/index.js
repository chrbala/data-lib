// @flow

import React, { Component } from 'react';
import { family, person } from './data';
import { get, push } from '../../src/flatteners/updater/array';

const Person = ({value, update}) =>
	<div>
		<label>name</label>
		<input value={value.name} onChange={e => update.Name(e.target.value)} />
		<br />
	</div>
;

const People = ({kind, value, update}) =>
	<div>
		{value.map((_person, i) => 
			<Person key={i} value={_person} update={get(update)(i)} />
		)}
		<button onClick={() => push(update)(person.shape())}>Add {kind}</button>
	</div>
;

export default class Family extends Component {
	state = {
		familyState: family.shape(),
	};

	update = family.createUpdate({
		getState: () => this.state.familyState,
		subscribe: familyState => this.setState(
			{familyState}, 
			() => this.props.onChange(familyState)
		),
	});

	render() {
		const { familyState } = this.state;
		const { update } = this;

		return <div>
			<People 
				kind="adults" 
				value={familyState.adults} 
				update={update.adults} 
			/>
			<br />
			<People 
				kind="children" 
				value={familyState.children} 
				update={update.children} 
			/>
		</div>;
	}
}