// const typeCheck = ({}).toString.call(type);

var collection = ((type, model, hasEntries) => {
    const isArray = Array.isArray(dataset);
    const isObject = isArray ? false : (dataset + '').indexOf('Object') >= 0;

    // Check if the array has entries.
    const data = isArray && hasEntries ? type : type.map((item, i) => [i, item]);

    const properties = {
        data,
        get entries() {
            return this.data;
        }
    };
    return properties;
});

var stateObject = (() => {});

export { collection as Collection, stateObject as o };
//# sourceMappingURL=soucouyant.js.map
