(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.soucouyant = {})));
}(this, (function (exports) { 'use strict';

// A cache to register the usage of various methods.
var cache = {
	subscriptions: {},
	suspend: {}
};

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

    // console.log('cache',cache)
    var subscriptions = cache.subscriptions;
    // Execute subscriptions
    if (subscriptions[identity] === undefined) {
        subscriptions[identity] = {};
    }
    var subIdentity = subscriptions[identity];
    var subIdentityLength = Object.keys(subIdentity).length;

    for (var ref in subIdentity) {
        subIdentity[ref](directReference, identity, currentTimeStamp);
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

/** 
 * @param {*} state
 * @param {number} identity - the unique state subscription identifier
 */
var stateMachine = function stateMachine(state, identity) {
    var stateModifier = function stateModifier(callback) {
        var lastState = state === null ? getCurrentState(identity) : state;
        var newState = callback(lastState);
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
    stateModifier.subscribe = function (ref, callback) {
        if (cache.subscriptions[identity] === undefined) {
            cache.subscriptions[identity] = {};
            cache.suspend[identity] = {};
        }
        if (cache.subscriptions[identity][ref] === undefined) {
            cache.suspend[identity][ref] = false;
            cache.subscriptions[identity][ref] = function () {
                if (!cache.suspend[identity][ref]) {
                    callback.apply(undefined, arguments);
                }
            };
        } else {
            console.error('The subscriptions reference ' + ref + ' is already in use for identity ' + identity);
        }
    };

    /** 
     * suspend method.
     * @param {string} ref - subscription reference.
     * @param {Function} callback - On subscribe callback
     */
    stateModifier.suspend = function (ref) {
        cache.suspend[identity][ref] = true;
    };

    /** 
     * suspend method.
     * @param {string} ref - subscription reference.
     * @param {Function} callback - On subscribe callback
     */
    stateModifier.unsubscribe = function (ref) {
        delete cache.subscriptions[identity][ref];
    };

    return stateModifier;
};

// Identity ensures that each 
// state has a unique key for the: 
// cacne.subscriptions[identity]
// as an object.
// That object then stores references for each
// subscription. See above.
var identity = -1;
/** 
 * 
 * @param {Array} addressParts - Namespaces separated by > 
 * @param {number} count - 0.
 * @param {*} state
 * @param {number} length - Number of namespaces.
 * @param {boolean} isCollection - false.
 * @param {*} nextPart - null.
 */
var createAddress = function createAddress(addressParts, count, state, length, isCollection, nextPart) {
    var newPart = (addressParts[count] + '').trim();
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
        var isEndOfPath = count === length - 1;
        if (nextPart[newPart] === undefined) {
            identity++;
            var machine = isEndOfPath ? isCollection ? state : stateMachine(state, identity) : {};
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
    var addressParts = address[0].split('>');
    var addressPartsLength = addressParts.length;
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

var identity$1 = -1;
var collection = (function (type) {
    var hasEntries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    identity$1++;
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

    // Inital update
    addNewState(data, identity$1);

    var properties = {
        data: data,
        initialData: initalDataClone, // Clone inital data.
        get entries() {
            return getCurrentState(identity$1);
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
            addNewState(newEntries, identity$1);
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
