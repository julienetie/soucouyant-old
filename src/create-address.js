import StateObject from './state-object';
import { addNewState, getCurrentState } from './accumilator';


const stateMachine = (state, identity) => {
    return callback => {
        const lastState = state === null ? getCurrentState(identity) : state;
        const newState = callback(lastState);
        addNewState(newState, identity);
        if (state !== null) {
            state = null;
        }
    }
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