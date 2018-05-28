import createAddress from './create-address';

/** 
 * State object is a side effect represented by the "o" letter.
 * It takes a namespace address separeated by forward arrows and 
 * an inital state.
 *
 * @param {string} address - The namespace address of the state object.
 * @param {*} state - The value of the state.
 * @returns {Function} StateObject.
 */
export default function StateObject(address, state) {
    const addressParts = address[0].split('>');
    const addressPartsLength = addressParts.length;
    createAddress(
        addressParts,
        0,
        state,
        addressPartsLength,
        false,
        null
    );
    return StateObject
}