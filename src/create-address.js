import StateObject from './state-object';
import { addNewState, getCurrentState } from './accumilator';
import cache from './cache';

const stateMachine = (state, identity) => {
    const stateModifier = callback => {
        const lastState = state === null ? getCurrentState(identity) : state;
        const newState = callback(lastState);
        addNewState(newState, identity);
        if (state !== null) {
            state = null;
        }
        return newState;
    }

    stateModifier.subscribe = (ref, callback) => {
        if (cache.subscriptions[identity] === undefined) {
            cache.subscriptions[identity] = {};
        }

        if (cache.subscriptions[identity][ref] === undefined) {
            cache.subscriptions[identity][ref] = callback;
        } else {
            console.error(`The subscriptions reference ${ref} is already in use for identity ${identity}`);
        }
    }

    return stateModifier;
}

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
}

export default createAddress;