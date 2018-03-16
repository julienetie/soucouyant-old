import cache from 'cache';

/** 
 Accumilates frames.

**/
const accumilator = [[]];
const uniqueStateReferences = [];

const persistence = {
    options: {
        mergeFidelity: 0
    }
};

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
        const hasExistingState = JSON.stringify(uniqueState) === stateAsString;
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
    } else {
        // Add new frame.
        accumilator.push([currentTimeStamp, [identity, directReference]]);
    }

    const subscriptons = cache.subscriptons;
    // Execute subscriptons
    if (subscriptons[identity] === undefined) {
        subscriptons[identity] = {};
    }
    const subIdentity = subscriptons[identity];
    const subIdentityLength = Object.keys(subIdentity).length;

    for (let ref in subIdentity) {
        subIdentity[ref](directReference, identity, currentTimeStamp);
    }

    // console.log('accumilator', JSON.stringify(accumilator, null, '\t'));
};

const getCurrentState = identity => {
    const accumilatorLength = accumilator.length;
    for (let i = accumilatorLength; i > -1; --i) {
        const frame = accumilator[i] || [];
        const frameLength = frame.length;
        for (let j = 0; j < frameLength; j++) {
            if (frame[j][0] === identity) {
                return frame[j][1];
            }
        }
    }
};

var cache$1 = {
	subscriptions: {}
};

const stateMachine = (state, identity) => {
    const stateModifier = callback => {
        const lastState = state === null ? getCurrentState(identity) : state;
        const newState = callback(lastState);
        addNewState(newState, identity);
        if (state !== null) {
            state = null;
        }
        return newState;
    };

    stateModifier.subscribe = (ref, callback) => {
        if (cache$1.subscriptions[identity] === undefined) {
            cache$1.subscriptions[identity] = {};
        }

        if (cache$1.subscriptions[identity][ref] === undefined) {
            cache$1.subscriptions[identity][ref] = callback;
        } else {
            console.error(`The subscriptioin reference ${ref} is already in use for identity ${identity}`);
        }
    };

    return stateModifier;
};

let identity = -1;
const createAddress = (addressParts, count, state, length, isCollection, nextPart) => {
    if (nextPart === null) {
        const newPart = (addressParts[count] + '').trim();
        if (StateObject[newPart] === undefined) {
            nextPart = StateObject[newPart] = {};
        } else {
            nextPart = StateObject[newPart];
        }
    } else {
        const isEndOfPath = count === length - 1;
        const newPart = (addressParts[count] + '').trim();
        if (nextPart[newPart] === undefined) {
            identity++;
            const machine = isEndOfPath ? isCollection ? state : stateMachine(state, identity) : {};
            nextPart = nextPart[newPart] = machine;
            if (isEndOfPath) {
                return;
            }
        } else {
            nextPart = nextPart[newPart];
            if (isEndOfPath) {
                return;
            }
        }
    }
    count++;
    createAddress(addressParts, count, state, length, isCollection, nextPart);
};

function StateObject(address, state) {
    const addressParts = address[0].split('>');
    const addressPartsLength = addressParts.length;

    createAddress(addressParts, 0, state, addressPartsLength, false, null);
    return StateObject;
}

const checkType = type => {
    switch (type) {
        case Array:
            return [];
        case Object:
            return '';
        default:
            return type;
        // if (Array.isArray()) {
        //     return type;
        // }
    }
};

let identity$1 = -1;
var collection = ((type, hasEntries = false) => {
    identity$1++;
    // Get the corresponding dataset according to the type.
    const dataset = checkType(type);
    const isArray = Array.isArray(dataset);
    const isObject = isArray ? false : (dataset + '').indexOf('Object') >= 0;

    // Check if the array has entries.
    const data = isArray && hasEntries ? type : dataset.map((item, i) => [i, item]);

    // A Deletable clone. 
    let initalDataClone = Array.from(data);

    // Inital update
    addNewState(data, identity$1);

    const properties = {
        data,
        initialData: initalDataClone, // Clone inital data.
        get entries() {
            return getCurrentState(identity$1);
        },
        get states() {
            return this.data.map(entry => entry[1]);
        },
        get ids() {
            return this.data.map(entry => entry[0]);
        },
        update(newEntries) {
            addNewState(newEntries, identity$1);
        },
        get firstId() {
            return this.data[0][0];
        },
        get lastId() {
            const length = this.data.length;
            return this.data[length - 1][0];
        },
        get nextId() {
            const length = this.data.length;
            return this.data[length - 1][0];
        },
        get lastIndex() {
            return this.data.length - 1;
        },
        get nextIndex() {
            return this.data.length;
        },
        get firstState() {
            return this.data[0][1];
        },
        get lastState() {
            const length = this.data.length - 1;
            console.log(length);
            return this.data[length][1];
        },
        get firstEntry() {
            return this.data[0];
        },
        get lastEntry() {
            const length = this.data.length;
            return this.data[length - 1];
        },
        get length() {
            return this.data.length;
        }
    };
    // return properties;
    return address => {

        const addressParts = address[0].split('>');
        const addressPartsLength = addressParts.length;

        createAddress(addressParts, 0, properties, addressPartsLength, true, null);
    };
});

// get lastRemovedIds(){
// 	return 
// }
// get initalLength() {
//     return initalDataClone.length;
// }
// get initalEntries() {
//     return initalDataClone;
// }
// get initalIds() {
//     return initalDataClone.map(entry => entry[0]);
// }
// get initalStates() {
//     return initalDataClone.map(entry => entry[0]);
// }

export { collection as Collection, StateObject as o };
//# sourceMappingURL=soucouyant.js.map
