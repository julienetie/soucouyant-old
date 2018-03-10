import StateObject from './state-object';
import createAddress from './create-address';


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
}

export default (type, hasEntries = false) => {

    // Get the corresponding dataset according to the type.
    const dataset = checkType(type);
    const isArray = Array.isArray(dataset);
    const isObject = isArray ? false : ((dataset) + '').indexOf('Object') >= 0;

    // Check if the array has entries.
    const data = isArray && hasEntries ? type : dataset.map((item, i) => [i, item]);

    // A Deletable clone. 
    let initalDataClone = Array.from(data);

    const properties = {
        data,
        initialData: initalDataClone, // Clone inital data.
        get entries() {
            return this.data;
        },
        get states() {
            return this.data.map(entry => entry[1]);
        },
        get ids() {
            return this.data.map(entry => entry[0]);
        },
        update(newEntries) {
            this.data = newEntries;
            return this;
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
            console.log(length)
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
        },
    }
    // return properties;
    return (address) => {

        const addressParts = address[0].split('>');
        const addressPartsLength = addressParts.length;

        createAddress(
            addressParts,
            0,
            properties,
            addressPartsLength,
            true,
            null
        );
    }
}



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