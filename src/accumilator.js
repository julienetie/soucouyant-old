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
    const currentTimeStamp = Date.now();
    const mergeFidelity = persistence.options.mergeFidelity;
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

    if (stateExist === false) {
        uniqueStateReferences.push(state);
        directReference = uniqueStateReferences[uniqueStateReferences.length - 1];
    }

    // Find frame by timestamp
    const accumilatorLength = accumilator.length;
    const lastFrame = accumilator[accumilatorLength - 1];
    const lastFrameTimeStamp = lastFrame[0];

    // If within proximity merge. 
    const withinMergePeriod = lastFrameTimeStamp + mergeFidelity > currentTimeStamp;
    if (withinMergePeriod) {
        // merge to last frame
        lastFrame.push([identity, directReference]);
    }else{
    	// Add new frame.
    	accumilator.push([
    		currentTimeStamp,
    		[
    			identity,
    			directReference
    		]
    	]);
    }
}

