// import test from 'tape';
// import { typecase } from '../src/typecase';

// const commonTypes = {
//     string: 'Hello World!',
//     number: 8,
//     boolean: false,
//     function: () => {},
//     symbol: Symbol(),
//     undefined: undefined,
//     object: {},
//     NaN: NaN,
//     null: null,
//     array: [],
//     regExp: /abc/,
//     objectString: new String(),
//     objectNumber: new Number(),
//     // objectBlob: new Blob(),   '// Cannot test blob "type" within node.
//     objectBoolean: new Boolean(),
//     objectDate: new Date(),
//     objectMap: new Map(),
//     objectWeakMap: new WeakMap(),
// };

// // Each type is tested with a value that should pass true & false.
// const number = 8;
// const string = 'foo';
// const noop = function() {};
// const arrowNoop = () => {};

// test('typecase: Should be a function.', t => {
//     t.plan(1);
//     t.equal(typeof typecase, 'function');
// });

// test('typecase: Should return a function.', t => {
//     t.plan(1);
//     t.equal(typeof typecase({}), 'function');
// });

// test('type: Should have an if method.', t => {
//     const If = typecase({});
//     t.plan(1);
//     t.equal(typeof If, 'function');
// });


// // if
// test('if: Returns given value for a matching type', t => {
//     const If = typecase({});
//     t.plan(17);
//     Object.keys(commonTypes).forEach(commonType => {
//         switch (commonType) {
//             case 'NaN':
//                 const returnValue = If(commonTypes[commonType])[commonType];
//                 t.equal(Object.is(returnValue, NaN), true);
//                 break;
//             default:
//                 t.equal(If(commonTypes[commonType])[commonType], commonTypes[commonType]);
//         }
//     });
// });


// test('if: Should throw an error for an incorrect type match', t => {
//     const typeList = Object.keys(commonTypes);
//     const errorHandlers = {};
//     const errorHandler = function(value) { throw new Error(`The ${value} is not of type ${commonType}`) };
//     typeList.forEach(commonType => errorHandlers[commonType] = errorHandler);

//     const If = typecase({ errorHandlers });

//     t.plan(17 * 16);
//     typeList.forEach(commonType => {
//         typeList.forEach(commonType2 => {
//             if (commonType !== commonType2) {
//                 t.throws(function() { If(commonTypes[commonType])[commonType2] });
//             }
//         });
//     });
// });