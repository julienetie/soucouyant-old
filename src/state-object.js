import createAddress from './create-address';

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