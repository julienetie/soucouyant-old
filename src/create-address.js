import StateObject from './state-object';
import { addNewState, getCurrentState } from './accumilator';
import cache from './cache';

/** 
 * @param {*} state
 * @param {number} identity - the unique state subscription identifier
 */
const stateMachine = (state, identity) => {
    const stateModifier = callback => {
        const lastState = state === null ? getCurrentState(identity) : state;
        const newState = callback(lastState);

        // We only update state if return is undefined.
        if (newState !== undefined) {
            addNewState(newState, identity);
            if (state !== null) {
                state = null;
            }
        }
        return newState;
    }
    /** 
     * subscribe method.
     * @param {string} ref - subscription reference.
     * @param {Function} callback - On subscribe callback
     */
    stateModifier.subscribe = (ref, callback) => {
        if (cache.subscriptions[identity] === undefined) {
            cache.subscriptions[identity] = {};
            cache.suspend[identity] = {};
        }
        if (cache.subscriptions[identity][ref] === undefined) {
            cache.suspend[identity][ref] = false;
            cache.subscriptions[identity][ref] = (...parameters) => {
                if (!cache.suspend[identity][ref]) {
                    callback(...parameters);
                }
            };
        } else {
            console.error(`The subscriptions reference ${ref} is already in use for identity ${identity}`);
        }
    }

    /** 
     * suspend method.
     * @param {string} ref - subscription reference.
     * @param {Function} callback - On subscribe callback
     */
    stateModifier.suspend = ref => {
        cache.suspend[identity][ref] = true;
    }

    /** 
     * suspend method.
     * @param {string} ref - subscription reference.
     * @param {Function} callback - On subscribe callback
     */
    stateModifier.unsubscribe = ref => {
        delete cache.subscriptions[identity][ref];
    }

    return stateModifier;
}


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
}

export default createAddress;