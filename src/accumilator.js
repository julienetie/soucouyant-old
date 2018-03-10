/** 
 Accumilates frames.

**/
export const accumilator = [];
const uniqueStateReferences = {};

const persistence = {
    options: {
        mergeFidelity: NaN,
    }
};

// Update settings.
export const persistenceSettings = options => Object.assign(persistence.options, options);


// Adds a new state to the accumilator 
// May create a new frame to do so.
const addNewState = (state, identity) => {
    // Check unique states and add the state if does not yet exist.
    // Directly reference the existing state.
    const stateAsString = JSON.stringify(state);
    const uniqueStateReferencesLength = uniqueStateReferences.length;

    let stateExist = false;
    let directReference;
    for (let i = 0; i < uniqueStateReferencesLength; i++) {
        const uniqueState = uniqueStateReferences[i];
        const hasExistingState = JSON
            .stringify(uniqueState) === stateAsString;
        if (hasExistingState) {
        	directReference = uniqueState;
        	stateExist = true;
        	break;
        }
    }

    if(stateExist === false){
		uniqueStateReferences.push(state);
		directReference = uniqueStateReferences[uniqueStateReferences.length - 1];    	
    }
   

}