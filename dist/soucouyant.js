// A cache to register the usage of various methods.
var cache = {
	subscriptions: {},
	suspend: {}
};

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

    // console.log('cache',cache)
    const subscriptions = cache.subscriptions;
    // Execute subscriptions
    if (subscriptions[identity] === undefined) {
        subscriptions[identity] = {};
    }
    const subIdentity = subscriptions[identity];
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

/** 
 * @param {*} state
 * @param {number} identity - the unique state subscription identifier
 */
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
    /** 
     * subscribe method.
     * @param {string} ref - subscription reference.
     * @param {Function} callback - On subscribe callback
     */
    stateModifier.subscribe = (ref, callback) => {
        const hasSuspendedRecord = cache.suspend[identity] && cache.suspend[identity][ref];
        const isSuspended = hasSuspendedRecord ? cache.suspend[identity][ref] : false;

        if (cache.subscriptions[identity] === undefined) {
            cache.subscriptions[identity] = {};
        }
        if (cache.subscriptions[identity][ref] === undefined) {
            cache.subscriptions[identity][ref] = (...parameters) => {
                if (!isSuspended) {
                    callback(...parameters);
                }
            };
        } else {
            console.error(`The subscriptions reference ${ref} is already in use for identity ${identity}`);
        }
    };

    /** 
     * suspend method.
     * @param {string} ref - subscription reference.
     * @param {Function} callback - On subscribe callback
     */
    stateModifier.suspend = ref => {
        if (cache.suspend[identity] === undefined) {
            cache.suspend[identity] = {};
        }
        if (cache.suspend[identity][ref] === undefined) {
            cache.suspend[identity][ref] = true;
        }
        console.log('cache.suspend', cache.suspend);
    };

    return stateModifier;
};

// Identity ensures that each 
// state has a unique key for the: 
// cacne.subscriptions[identity]
// as an object.
// That object then stores references for each
// subscription. See above.
let identity = -1;
/** 
 * 
 * @param {Array} addressParts - Namespaces separated by > 
 * @param {number} count - 0.
 * @param {*} state
 * @param {number} length - Number of namespaces.
 * @param {boolean} isCollection - false.
 * @param {*} nextPart - null.
 */
const createAddress = (addressParts, count, state, length, isCollection, nextPart) => {
    const newPart = (addressParts[count] + '').trim();
    if (nextPart === null) {
        // Creates the next property as an object.
        // And assigns the nextPart as that property to 
        // recycle into it's self to add additional levels.
        // Once!
        if (StateObject[newPart] === undefined) {
            nextPart = StateObject[newPart] = {};
        } else {
            nextPart = StateObject[newPart];
        }
    } else {
        // Creates the next property as an object.
        // And assigns the nextPart as that property to 
        // recycle into it's self to add additional levels.
        // beyond the first (I think)
        const isEndOfPath = count === length - 1;
        if (nextPart[newPart] === undefined) {
            identity++;
            const machine = isEndOfPath ? isCollection ? state : stateMachine(state, identity) : {};
            nextPart = nextPart[newPart] = machine; // Creates the next property as an object.
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

/** 
 * State object is a side effect represented by the "o" letter.
 * It takes a namespace address separeated by forward arrows and 
 * an inital state.
 *
 * @param {string} address - The namespace address of the state object.
 * @param {*} state - The value of the state.
 * @returns {Function} StateObject.
 */
function StateObject(address, state) {
    const addressParts = address[0].split('>');
    const addressPartsLength = addressParts.length;
    createAddress(addressParts, 0, state, addressPartsLength, false, null);
    return StateObject;
}

/**
 Collections is still a work in progress. 
 It has a fantastic concept that allows the dev 
 to pass the collection outside of the api and 
 then back in to be updated so they can make use of
 native array and object methods without having to 
 re-implement them for the API thus keeping the 
 library tiny. Collections is basically a psuedo
 dataset, think of arrays but with references.

 E.g. in a todoapp a collection will not require 
 an id, it comes with one already.
 */

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
