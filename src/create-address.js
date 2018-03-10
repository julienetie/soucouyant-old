import StateObject from './state-object';

const stateMachine = (state, stateObject) => callback => {
    state = callback(state);
    return state;
}


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

            const machine = isEndOfPath ? isCollection ? state : stateMachine(state, nextPart[newPart]) : {};
            nextPart = nextPart[newPart] = machine
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