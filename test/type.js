// import test from 'tape';
// import { type } from '../src/typecase';


// // Each type is tested with a value that should pass true & false.
// const number = 8; 
// const string = 'foo';
// const noop = function(){};
// const arrowNoop = ()=>{};


// test('type: Should be a function.', t => {
//     t.plan(1);
//     t.equal(typeof type, 'function');
// });

// /** 
//  * Array
//  */
// test('type: array', t => {
//     t.plan(4);
//     t.equal(type([]).array, true);
//     t.equal(type(Array()).array, true);
//     t.equal(type(new Array()).array, true);
//     // Incorrect type.
//     t.equal(type(number).array, false);
// });


// /** 
//  * Boolean
//  */
// test('type: boolean | objectBoolean', t => {
//     t.plan(5);
//     t.equal(type(true).boolean, true);
//     t.equal(type(Boolean(true)).boolean, true);
//     t.equal(type(new Boolean()).objectBoolean, true);
//     // Incorrect type.
//     t.equal(type(number).boolean, false);
//     t.equal(type(number).objectBoolean, false);
// });


/** 
 * Date | Map | Symbol | WeakMap
 */
test('type: objectDate | objectMap | symbol | objectWeakMap', t => {
    t.plan(8);
    t.equal(type(new Date()).objectDate, true);
    t.equal(type(new Map()).objectMap, true);
    t.equal(type(Symbol(string)).symbol, true);
    t.equal(type(new WeakMap()).objectWeakMap, true);
    // Incorrect type.
    t.equal(type(string).objectDate, false);
    t.equal(type(string).objectMap, false);
    t.equal(type(number).symbol, false);
    t.equal(type(string).objectWeakMap, false);
});


/** 
 * Function
 */
test('type: function', t => {
    t.plan(5);
    t.equal(type(arrowNoop).function, true);
    t.equal(type(noop).function, true);
    t.equal(type(Function()).function, true);
    t.equal(type(new Function()).function, true);
    // Incorrect type.
    t.equal(type(string).function, false);
});


/* 
 * Null | Undefined | NaN
 */
test('type: null | undefined | NaN', t => {
    t.plan(6);
    t.equal(type(undefined).undefined, true);
    t.equal(type(null).null, true);
    t.equal(type(NaN).NaN, true);
    // Incorrect type.
    t.equal(type(null).undefined, false);
    t.equal(type(NaN).null, false);
    t.equal(type(undefined).NaN, false);
});


/* 
 * Number
 */
test('type: number', t => {
    t.plan(5);
    t.equal(type(1000).number, true);
    t.equal(type(Number(1000)).number, true);
    t.equal(type(new Number()).objectNumber, true);
    // Incorrect type.
    t.equal(type(noop).number, false);
    t.equal(type(number).objectNumber, false);
});


/* 
 * RegExp
 */
test('type: regExp', t => {
    t.plan(4);
    t.equal(type(/test/).regExp, true);
    t.equal(type(RegExp()).regExp, true);
    t.equal(type(new RegExp()).regExp, true);
    // Incorrect type.
    t.equal(type(number).regExp, false);
});



/* 
 * String
 */
test('type: string', t => {
    t.plan(5);
    t.equal(type(string).string, true);
    t.equal(type(String()).string, true);
    t.equal(type(new String()).objectString, true);
    // Incorrect type.
    t.equal(type(number).string, false);
    t.equal(type(noop).objectString, false);
});