// @flow

import React from 'react';
import Relay, { GraphQLMutation } from 'react-relay';

import Family from 'examples/full-stack/react/family';
import State from 'examples/full-stack/react/shared/state';
import { combine } from 'examples/setup';
import { boolean } from 'examples/schema';
import EditFamily from 'examples/full-stack/react/editFamily';
import { 
	family as familySchema,
} from '../shared/schema';

const insertFamilyQuery = Relay.QL`
	mutation($input:insertFamilyMutation!) {
		insertFamily(input:$input) {
			clientMutationId
			edge {
				node {
					id
					adults {
						id
						name
					}
					children {
						id
						name
					}
				}
			}
		}
	}
`;

const insertPersonConfigs = parentID => [{
	type: 'RANGE_ADD',
	parentName: 'viewer',
	parentID,
	connectionName: 'personAll',
	edgeName: 'edge',
	rangeBehaviors: {
		'': 'append',
	},
}];

const insertFamily = (input, configs) =>  
	GraphQLMutation.create(
		insertFamilyQuery, 
		{input}, 
		Relay.Store
	).commit(configs);

const Families = ({viewer, state, update}) => 
	<div>
		{viewer.familyAll.edges.map(({node}) => 
			<Family 
				key={node.id} 
				family={node} 
				viewer={viewer}
			/>
		)}

		{state.insertMode 
			? <EditFamily
					viewer={viewer}
					onCancel={() => update('insertMode').set(false)}
					onSave={person => {
						update('insertMode').set(false);
						insertFamily({person}, insertPersonConfigs(viewer.__dataID__));
					}}
					family={familySchema.shape()}
					mutateText='save'
				/>
			: <button onClick={() => update('insertMode').set(true)}>
					add family
				</button>
		}
	</div>
;

type PropsType = { 
	viewer: {
		personAll: Array<*>,
	},
};

const peopleState = combine({
	insertMode: boolean,
});

export default (props: PropsType) => <State
	children={Families}
	schema={peopleState}
	{...props}
/>;
