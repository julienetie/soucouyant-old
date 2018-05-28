import test from 'tape';
import { o } from '../src';
o `helper > number > counter ${0}`;
const counter = o.helper.number.counter;
const varyCounter = amount => counter(state => state + amount);
const { isInteger } = Number;
let count = 0;
test('Susbscribe: Should trigger on state change', t => {
    t.plan(2);
    counter.subscribe('reference', (state, identitiy, timeStamp) => {
        count++;
        const validParameters = isInteger(identitiy) &&
            isInteger(timeStamp);

        switch (count) {
            case 1:
                t.equal(validParameters && state === 1, true);
                break;
            case 2:
                t.comment(state)
                t.equal(validParameters && state === 6, true);
                break;
        }
    });
    varyCounter(1);
    varyCounter(5);
});