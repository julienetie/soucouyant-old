(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.soucouyant = {})));
}(this, (function (exports) { 'use strict';

/** 
 Accumilates frames.

**/
var accumilator = [[]];
var uniqueStateReferences = [];

var persistence = {
    options: {
        mergeFidelity: 0
    }
};

// Adds a new state to the accumilator 
// May create a new frame to do so.
var addNewState = function addNewState(state, identity) {
    var currentTimeStamp = Date.now();
    var mergeFidelity = persistence.options.mergeFidelity;
    // Check unique states and add the state if does not yet exist.
    // Directly reference the existing state.
    var stateAsString = JSON.stringify(state);
    var uniqueStateReferencesLength = uniqueStateReferences.length;

    var stateExist = false;
    var directReference = void 0;
    for (var i = 0; i < uniqueStateReferencesLength; i++) {
        var uniqueState = uniqueStateReferences[i];
        var hasExistingState = JSON.stringify(uniqueState) === stateAsString;
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
    var accumilatorLength = accumilator.length;
    var lastFrame = accumilator[accumilatorLength - 1];
    var lastFrameTimeStamp = lastFrame[0];

    // If within proximity merge. 
    var withinMergePeriod = lastFrameTimeStamp + mergeFidelity > currentTimeStamp;
    if (withinMergePeriod) {
        // merge to last frame
        lastFrame.push([identity, directReference]);
    } else {
        // Add new frame.
        accumilator.push([currentTimeStamp, [identity, directReference]]);
    }
    // console.log('accumilator', JSON.stringify(accumilator, null, '\t'));
};

var getCurrentState = function getCurrentState(identity) {
    var accumilatorLength = accumilator.length;
    for (var i = accumilatorLength; i > -1; --i) {
        var frame = accumilator[i] || [];
        var frameLength = frame.length;
        for (var j = 0; j < frameLength; j++) {
            if (frame[j][0] === identity) {
                return frame[j][1];
            }
        }
    }
};

var stateMachine = function stateMachine(state, identity) {
    return function (callback) {
        var lastState = state === null ? getCurrentState(identity) : state;
        var newState = callback(lastState);
        addNewState(newState, identity);
        if (state !== null) {
            state = null;
        }
    };
};

var identity = -1;
var createAddress = function createAddress(addressParts, count, state, length, isCollection, nextPart) {
    if (nextPart === null) {
        var newPart = (addressParts[count] + '').trim();
        if (StateObject[newPart] === undefined) {
            nextPart = StateObject[newPart] = {};
        } else {
            nextPart = StateObject[newPart];
        }
    } else {
        var isEndOfPath = count === length - 1;
        var _newPart = (addressParts[count] + '').trim();
        if (nextPart[_newPart] === undefined) {
            identity++;
            var machine = isEndOfPath ? isCollection ? state : stateMachine(state, identity) : {};
            nextPart = nextPart[_newPart] = machine;
            if (isEndOfPath) {
                return;
            }
        } else {
            nextPart = nextPart[_newPart];
            if (isEndOfPath) {
                return;
            }
        }
    }
    count++;
    createAddress(addressParts, count, state, length, isCollection, nextPart);
};

function StateObject(address, state) {
    var addressParts = address[0].split('>');
    var addressPartsLength = addressParts.length;

    createAddress(addressParts, 0, state, addressPartsLength, false, null);
    return StateObject;
}

var checkType = function checkType(type) {
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

var collection = (function (type) {
    var hasEntries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    // Get the corresponding dataset according to the type.
    var dataset = checkType(type);
    var isArray = Array.isArray(dataset);
    var isObject = isArray ? false : (dataset + '').indexOf('Object') >= 0;

    // Check if the array has entries.
    var data = isArray && hasEntries ? type : dataset.map(function (item, i) {
        return [i, item];
    });

    // A Deletable clone. 
    var initalDataClone = Array.from(data);

    var properties = {
        data: data,
        initialData: initalDataClone, // Clone inital data.
        get entries() {
            return this.data;
        },
        get states() {
            return this.data.map(function (entry) {
                return entry[1];
            });
        },
        get ids() {
            return this.data.map(function (entry) {
                return entry[0];
            });
        },
        update: function update(newEntries) {
            this.data = newEntries;
            return this;
        },

        get firstId() {
            return this.data[0][0];
        },
        get lastId() {
            var length = this.data.length;
            return this.data[length - 1][0];
        },
        get nextId() {
            var length = this.data.length;
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
            var length = this.data.length - 1;
            console.log(length);
            return this.data[length][1];
        },
        get firstEntry() {
            return this.data[0];
        },
        get lastEntry() {
            var length = this.data.length;
            return this.data[length - 1];
        },
        get length() {
            return this.data.length;
        }
    };
    // return properties;
    return function (address) {

        var addressParts = address[0].split('>');
        var addressPartsLength = addressParts.length;

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

exports.Collection = collection;
exports.o = StateObject;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=soucouyant.umd.js.map
