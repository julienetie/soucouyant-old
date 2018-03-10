// import test from 'tape';
// import { type } from '../src/typecase';


// // Each type is tested with a value that should pass true & false.
// const number = 8;
// const string = 'foo';
// const noop = function() {};
// const arrowNoop = () => {};


// test('type: Should be a function.', t => {
//     t.plan(1);
//     t.equal(typeof type, 'function');
// });

// /** 
//  * true
//  */
// test('type: true', t => {
//     t.plan(5);
//     t.equal(type(true).true, true);
//     t.equal(type(false).true, false);
//     t.equal(type(null).true, false);
//     t.equal(type(undefined).true, false);
//     t.equal(type(string).true, false);
// });


// /** 
//  * false
//  */
// test('type: false', t => {
//     t.plan(5);
//     t.equal(type(true).false, false);
//     t.equal(type(false).false, true);
//     t.equal(type(null).false, false);
//     t.equal(type(undefined).false, false);
//     t.equal(type(string).false, false);
// });


// /** 
//  * exist
//  */
// test('type: exist', t => {
//     t.plan(7);
//     t.equal(type(true).exist, true);
//     t.equal(type(false).exist, true);
//     t.equal(type(null).exist, false);
//     t.equal(type(undefined).exist, false);
//     t.equal(type(NaN).exist, true);
//     t.equal(type('').exist, true);
//     t.equal(type(0).exist, true);
// });

// /** 
//  * empty
//  */
// test('type: empty', t => {
//     t.plan(7);
//     t.equal(type(true).empty, false);
//     t.equal(type(false).empty, false);
//     t.equal(type(null).empty, true);
//     t.equal(type(undefined).empty, true);
//     t.equal(type(NaN).empty, false);
//     t.equal(type('').empty, true);
//     t.equal(type(0).empty, false);
// });


// /** 
//  * zero
//  */
// test('type: zero', t => {
//     t.plan(7);
//     t.equal(type(true).zero, false);
//     t.equal(type(false).zero, false);
//     t.equal(type(null).zero, true);
//     t.equal(type(undefined).zero, true);
//     t.equal(type(NaN).zero, true);
//     t.equal(type('').zero, false);
//     t.equal(type(0).zero, true);
// });


// /** 
//  * every
//  */
// test('type: every', t => {
//     t.plan(2);

//     const values1 = type(
//         1000,
//         'Hello World', [1, 2, 3],
//         new Boolean(),
//         () => {}
//     ).every('number', 'string', 'array', 'objectBoolean', 'function')

//     const values2 = type(
//         1000,
//         'Hello World', [1, 2, 3],
//         new Boolean(),
//         () => {}
//     ).every('number', 'string', 'array', 'boolean', 'function')

//     t.equal(values1, true);
//     t.equal(values2, false);
// });


// /** 
//  * some
//  */
// test('type: some', t => {
//     t.plan(9);

//     const valuesToMatch = [
//         1000,
//         'Hello World', [1, 2, 3],
//         new Boolean(),
//         () => {}
//     ];

//     // All are equal consecutively
//     const values1 = type(...valuesToMatch)
//     .some('number', 'string', 'array', 'objectBoolean', 'function')

//     // One is equal consecutively
//     const values2 = type(...valuesToMatch)
//     .some('number', 'regExp', 'regExp', 'regExp', 'objectBoolean')

//     // Two are equal consecutively
//     const values3 = type(...valuesToMatch)
//     .some('number', 'regExp', 'objectBoolean', 'regExp', 'objectDate')


//     // None are equal consecutively
//     const values4 = type(...valuesToMatch)
//     .some('object', 'regExp', 'object', 'object', 'regExp')

//     t.equal(values1, true);
//     t.equal(values2, true);
//     t.equal(values3, true);
//     t.equal(values4, false);

//     // All are equal 
//     const values5 = type(...valuesToMatch)
//     .some('number', 'string', 'array', 'objectBoolean')

//     // One is equal
//     const values6 = type(...valuesToMatch)
//     .some('regExp', 'regExp', 'number', )

//     // Two are equal
//     const values7 = type(...valuesToMatch)
//     .some('objectBoolean', 'regExp', 'function', 'regExp')

//     // Two are equal beyond length
//     const values8 = type(...valuesToMatch)
//     .some('objectBoolean', 'regExp', 'regExp', 'regExp', 'regExp', 'regExp', 'function')

//     // None are equal
//     const values9 = type(...valuesToMatch)
//     .some('object', 'regExp', 'object', 'regExp')

//     t.equal(values5, true);
//     t.equal(values6, true);
//     t.equal(values7, true);
//     t.equal(values8, true);
//     t.equal(values9, false);
// });


// /** 
//  * is
//  */
// test('type: is', t => {
//     t.plan(3);
//     t.equal(type(8).is === 'number',true);
//     t.equal(type(8).is === 'string', false);
//     t.equal(type(8).is === 'object', false);
// });


// /** 
//  * raw
//  */
// test('type: raw', t => {
//     t.plan(3);
//     t.equal(type(8).raw , '[object Number]');
//     t.equal(type('Hello World!').raw, '[object String]');
//     t.equal(type({}).raw , '[object Object]');
// });