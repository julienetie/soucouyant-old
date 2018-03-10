# Soucouyant

Fundamental implementation:

### Counter Example:
```javascript
import soucouyant from 'soucouyant'

const $ = soucouyant(x => ({
    counter$: 0
})

const varyCounter = amount => $.counter(state => state + amount)
varyCounter(1)    // Increment
varyCounter(-1)   // Decrement
```
##### soucouyant( config , default ) : Function
- 1st param: Accepts a function that expects an object, 2nd param: expects an object for defaults.
- 1st param provides an x parameter for valueless states.
- Returns a function with methods including created states.

##### soucouyant config structure:
```javascript
x => {
    uncategorisedExtant$: x,                 // extant-value
    _category: {
        _category2: {
            categorisedExtent: value        // extant-value
        }
    },
    // extant-states
    uncategorisedExtant: {
        stateA: x,                          // state
        stateB_: ()=>{},                    // state-hook
        stateC_: [value, callback],         // state-value-hook
        stateD: value                       // state-value
    }, 
    uncategorisedExtant: ['stateA','stateB','stateC']       // list-of-states
}
```

